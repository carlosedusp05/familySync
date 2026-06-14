import { useState, useMemo, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { formatToBRL } from "../utils/formatters";
import { listService } from "../services/listService";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

export function useList() {
  const location = useLocation();
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListToEdit, setSelectedListToEdit] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [warning, setWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const [pendingUpdates, setPendingUpdates] = useState([]);
  const pendingUpdatesRef = useRef([]);

  const [peddingUpdatesFavorite, setPendingUpdatesFavorite] = useState([]);
  const pendingUpdatesFavoriteRef = useRef([]);

  const token = Cookies.get("familysync_token");

  const user = token
    ? (() => {
        const decoded = jwtDecode(token);
        return {
          nome: decoded.nome,
          id: decoded.id_usuario,
          idFamily: decoded.is_familia,
        };
      })()
    : {};

  const idFamilia = sessionStorage.getItem("@FamilySync:family:id");

  const fetchLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await listService.getListsByFamily(idFamilia);

      if (response?.StatusCode === 200) {
        const { usuarios = [], id_familia } = response.Response || {};

        const allMappedLists = [];

        usuarios.forEach((usuario) => {
          const userLists = usuario.listas || [];
          userLists.forEach((lista) => {
            const listItems = (lista.itens || []).map((item) => ({
              id_item: item.id_item,
              nome_item:
                item.nome || item.nome_item || item.nome || "Item sem nome",
              valor_unitario: parseFloat(item.valor_unitario) || 0,
              quantidade: item.quantidade || 1,
              isSelected: item.comprado === 1,
              id_lista: item.id_lista,
            }));

            allMappedLists.push({
              id: lista.id_lista,
              nome: lista.nome || lista.nome_lista || "Lista sem nome",
              author: usuario.nome_usuario,
              favorita: lista.favorita,
              items: listItems,
              id_familia: id_familia,
              id_usuario: usuario.id_usuario,
            });
          });
        });

        setLists(allMappedLists);

        setActiveListId((currentId) => {
          if (currentId) return currentId;
          return allMappedLists.length > 0 ? allMappedLists[0].id : null;
        });
      }
    } catch (err) {
      console.error("Erro ao buscar listas:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [idFamilia]);

  useEffect(() => {
    pendingUpdatesRef.current = pendingUpdates;
  }, [pendingUpdates]);

  useEffect(() => {
    return () => {
      if (pendingUpdatesRef.current.length) {
        listService.updateItemsBatch(pendingUpdatesRef.current);
      }
    };
  }, []);

  useEffect(() => {
    pendingUpdatesFavoriteRef.current = peddingUpdatesFavorite;
  }, [peddingUpdatesFavorite]);

  useEffect(() => {
    return () => {
      if (pendingUpdatesFavoriteRef.current.length) {
        listService.updateFavoritesBatch(pendingUpdatesFavoriteRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pendingUpdatesRef.current.length) {
        listService.updateItemsBatch(pendingUpdatesRef.current);
      }

      if (pendingUpdatesFavoriteRef.current.length) {
        listService.updateFavoritesBatch(pendingUpdatesFavoriteRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (idFamilia) {
      fetchLists();
    }
  }, [fetchLists, idFamilia]);

  const computedLists = useMemo(() => {
    return lists
      .map((list) => {
        const totalItems = list.items?.length || 0;
        const selectedItemsCount =
          list.items?.filter((item) => item.isSelected).length || 0;

        const percentage =
          totalItems === 0
            ? 0
            : Math.round((selectedItemsCount / totalItems) * 100);
        const totalSpent =
          list.items?.reduce((acc, item) => acc + item.price * item.units, 0) ||
          0;

        const formattedTotal = formatToBRL(totalSpent);

        return {
          ...list,
          percentage_now: `${percentage}%`,
          total_spent: formattedTotal,
        };
      })
      .filter((list) =>
        list.nome.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => (b.favorita ? 1 : 0) - (a.favorita ? 1 : 0));
  }, [lists, searchQuery]);

  const activeList = useMemo(() => {
    return computedLists.find((list) => list.id === activeListId) || null;
  }, [computedLists, activeListId]);

  const toggleItem = useCallback(
    async (itemId) => {
      const currentItem = activeList?.items.find(
        (item) => item.id_item === itemId,
      );

      if (!currentItem) return;

      const novoValor = !currentItem.isSelected;

      setPendingUpdates((prev) => {
        const existing = prev.find((item) => item.id_item === itemId);

        if (existing) {
          return prev.map((item) =>
            item.id_item === itemId ? { ...item, comprado: novoValor } : item,
          );
        }

        return [
          ...prev,
          {
            id_item: itemId,
            comprado: novoValor,
          },
        ];
      });

      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id !== activeListId) return list;

          return {
            ...list,
            items: list.items.map((item) =>
              item.id_item === itemId
                ? { ...item, isSelected: novoValor }
                : item,
            ),
          };
        }),
      );
    },

    [(activeListId, activeList)],
  );

  const handleSelectAllItems = useCallback(() => {
    if (!activeList) return;

    const allSelected = activeList.items.every((item) => item.isSelected);
    const novoValor = !allSelected;

    setPendingUpdates((prev) => {
      const updates = [...prev];

      activeList.items.forEach((currentItem) => {
        const existingIndex = updates.findIndex(
          (item) => item.id_item === currentItem.id_item,
        );

        if (existingIndex >= 0) {
          updates[existingIndex] = {
            ...updates[existingIndex],
            comprado: novoValor,
          };
        } else {
          updates.push({
            id_item: currentItem.id_item,
            comprado: novoValor,
          });
        }
      });

      return updates;
    });

    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id !== activeListId) return list;

        return {
          ...list,
          items: list.items.map((item) => ({
            ...item,
            isSelected: novoValor,
          })),
        };
      }),
    );
  }, [activeList, activeListId]);

  // Funcionando
  const handleAddItem = useCallback(
    async (itemData, listId, updateState = true) => {
      console.log(itemData, listId);
      try {
        setIsLoading(true);
        setError(null);

        const idLista = listId || activeListId;

        if (!idLista) return null;

        const newItem = {
          nome_item: itemData.nome_item || itemData.name || "Sem nome",
          valor_unitario:
            parseFloat(itemData.valor_unitario) ||
            parseFloat(itemData.price) ||
            0,
          quantidade:
            parseInt(itemData.quantidade) || parseInt(itemData.units) || 1,
          comprado: false,
          id_lista: idLista,
        };

        const responseItem = await listService.createItems(newItem);

        if (responseItem.StatusCode !== 201) {
          triggerAlert(
            "Não foi possível adicionar o item... Tente novamente mais tarde!",
          );
          return null;
        }

        const formattedItem = {
          ...newItem,
          id_item: responseItem.Response.id_item,
        };

        if (updateState) {
          setLists((prevLists) =>
            prevLists.map((list) => {
              if (list.id !== idLista) return list;

              return {
                ...list,
                items: [...(list.items || []), formattedItem],
              };
            }),
          );
        }

        return formattedItem;
      } finally {
        setIsLoading(false);
      }
    },
    [activeListId],
  );

  const toggleFavorite = useCallback((listId) => {
    setLists((prev) => {
      const targetList = prev.find((list) => list.id === listId);

      if (!targetList) return prev;

      const novoValor = !targetList.favorita;

      setPendingUpdatesFavorite((prevFav) => {
        const existing = prevFav.find((item) => item.id_lista === listId);

        if (existing) {
          return prevFav.map((item) =>
            item.id_lista === listId ? { ...item, favorita: novoValor } : item,
          );
        }

        return [
          ...prevFav,
          {
            id_lista: listId,
            favorita: novoValor,
          },
        ];
      });

      return prev.map((list) =>
        list.id === listId ? { ...list, favorita: novoValor } : list,
      );
    });
  }, []);

  const handleDeleteList = useCallback(
    async (listId) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await listService.deleteList(listId);

        if (response.StatusCode !== 200) {
          triggerAlert(
            "Não foi possível deletar a lista... Tente novamente mais tarde!",
          );
          return;
        }

        setLists((prev) => prev.filter((list) => list.id !== listId));
        if (activeListId === listId) setActiveListId(null);
      } finally {
        setIsLoading(false);
      }
    },
    [activeListId],
  );

  const handleDeleteItem = useCallback(
    async (itemId) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!activeListId) return;

        const response = await listService.deleteItem(itemId);

        if (response.StatusCode !== 200) {
          triggerAlert(
            "Não foi possível deletar o item... Tente novamente mais tarde!",
          );
          return;
        }

        setPendingUpdates((prev) =>
          prev.filter((item) => item.id_item !== itemId),
        );

        setLists((prevLists) =>
          prevLists.map((list) => {
            if (list.id !== activeListId) return list;

            return {
              ...list,
              items: list.items.filter((item) => item.id_item !== itemId),
            };
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeListId],
  );

  const handleSaveList = useCallback(
    async (data) => {
      console.log(data);
      try {
        setIsLoading(true);
        setError(null);

        const newList = {
          id_usuario: user.id,
          id_familia: idFamilia,
          nome: data.nome,
          favorita: false,
          items: data.items || [],
        };

        const responseList = await listService.createList(newList);

        if (responseList.StatusCode !== 201) {
          triggerAlert(
            "Não foi possível criar a lista... Tente novamente mais tarde!",
          );
          handleCloseModal();
          return;
        }

        let items = [];

        if (newList.items) {
          items = await Promise.all(
            newList.items.map((item) =>
              handleAddItem(item, responseList.Response.lista.id_lista, false),
            ),
          );

          if (!items.length) {
            triggerAlert(
              "Lista criada... Porém houveram problemas na criação dos items. Tente novamente mais tarde!",
            );
            handleCloseModal();
          }
        }

        const newItemToState = {
          ...newList,
          id: responseList.Response.lista.id_lista,
          author: user.nome,
          items,
        };

        setLists((prev) => [newItemToState, ...prev]);

        handleCloseModal();
      } finally {
        setIsLoading(false);
      }
    },
    [selectedListToEdit],
  );

  const handleSaveListEdition = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        setError(null);

        const listId = selectedListToEdit.id;

        if (data.nome !== undefined) {
          const updatedList = await listService.updateList(listId, {
            nome: data.nome,
          });

          if (updatedList.StatusCode !== 200) {
            triggerAlert(
              "Não foi possível atualizar a lista... Tente novamente mais tarde!",
            );
            handleCloseModal();
            return;
          }
        }

        if (data.items?.length) {
          await Promise.all(
            data.items.map((item) => handleAddItem(item, listId)),
          );
        }

        if (data.nome !== undefined) {
          setLists((prev) =>
            prev.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    nome: data.nome,
                  }
                : list,
            ),
          );
        }

        handleCloseModal();
      } catch (error) {
        console.error(error);

        triggerAlert(
          "Não foi possível atualizar a lista... Tente novamente mais tarde!",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedListToEdit],
  );

  const handleOpenModal = useCallback((list = null, isEdit = true) => {
    setSelectedListToEdit(list);
    setIsModeEdition(isEdit);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedListToEdit(null);
      setIsModeEdition(false);
    }, 200);
  }, []);

  function triggerAlert(message) {
    setWarning(message);
    setShowWarning(true);

    setTimeout(() => {
      setShowWarning(false);
    }, 2500);

    setTimeout(() => {
      setWarning("");
    }, 3000);
  }

  return {
    lists: computedLists,
    activeList,
    setActiveListId,
    searchQuery,
    setSearchQuery,
    toggleItem,
    handleSelectAllItems,
    toggleFavorite,
    handleOpenModal,
    handleCloseModal,
    handleDeleteList,
    handleSaveList,
    handleSaveListEdition,
    isModalOpen,
    isModeEdition,
    selectedListToEdit,
    handleAddItem,
    handleDeleteItem,
    isLoading,
    error,
    refreshLists: fetchLists,
    warning,
    showWarning,
  };
}
