import { useState, useMemo, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { formatToBRL } from "../utils/formatters";
import { listService } from "../services/listService";

export function useList() {
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
              id: item.id_item,
              nome_item:
                item.nome || item.nome_item || item.nome || "Item sem nome",
              valor_unitario: parseFloat(item.valor_unitario) || 0,
              quantidade: item.quantidade || 1,
              isSelected: item.comprado === 1,
              id_lista: item.id_lista,
            }));

            allMappedLists.push({
              id: lista.id_lista,
              nome: lista.nome_lista || lista.nome || "Lista sem nome",
              author: usuario.nome_usuario,
              isFavorite: false,
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
      .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }, [lists, searchQuery]);

  const activeList = useMemo(() => {
    return computedLists.find((list) => list.id === activeListId) || null;
  }, [computedLists, activeListId]);

  const toggleItem = useCallback(
    async (itemId) => {
      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id !== activeListId) return list;
          return {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId
                ? { ...item, isSelected: !item.isSelected }
                : item,
            ),
          };
        }),
      );
    },
    [activeListId],
  );

  const handleSelectAllItems = useCallback(() => {
    if (!activeList) return;
    const allSelected = activeList.items.every((item) => item.isSelected);

    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id !== activeListId) return list;
        return {
          ...list,
          items: list.items.map((item) => ({
            ...item,
            isSelected: !allSelected,
          })),
        };
      }),
    );
  }, [activeList, activeListId]);

  // Funcionando
  const handleAddItem = useCallback(
    async (itemData, listId) => {
      try {
        setIsLoading(true);
        setError(null);

        const idLista = listId || activeListId;

        if (!idLista) return;

        const newItem = {
          nome_item: itemData.name || "Sem nome",
          valor_unitario: parseFloat(itemData.price) || 0,
          quantidade: parseInt(itemData.units) || 1,
          comprado: false,
          id_lista: activeListId,
        };

        const responseItem = await listService.createItems(newItem);

        if (responseItem.StatusCode !== 201) {
          triggerAlert(
            "Não foi possível adicionar o item... Tente novamente mais tarde!",
          );
          return;
        }

        setLists((prevLists) =>
          prevLists.map((list) => {
            if (list.id !== activeListId) return list;
            return {
              ...list,
              items: [...(list.items || []), newItem],
            };
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeListId],
  );

  const toggleFavorite = useCallback((listId) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, isFavorite: !list.isFavorite } : list,
      ),
    );
  }, []);

  //Funcionando
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

        console.log(response);

        if (response.StatusCode !== 200) {
          triggerAlert(
            "Não foi possível deletar o item... Tente novamente mais tarde!",
          );
          return;
        }

        setLists((prevLists) =>
          prevLists.map((list) => {
            if (list.id !== activeListId) return list;

            return {
              ...list,
              items: list.items.filter((item) => item.id !== itemId),
            };
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeListId],
  );

  //Funcionando
  const handleSaveList = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        setError(null);

        if (selectedListToEdit) {
          setLists((prev) =>
            prev.map((list) =>
              list.id === selectedListToEdit.id
                ? { ...list, nome: data.nome, items: data.items }
                : list,
            ),
          );
        } else {
          const newList = {
            id_usuario: user.id,
            id_familia: idFamilia,
            nome: data.nome,
            isFavorite: false,
            items: data.items || [],
          };

          const responseList = await listService.createList(newList);

          console.log(responseList);

          await Promise.all(
            newList.items.map((item) =>
              handleAddItem(item, responseList.lista.id_lista),
            ),
          );

          if (responseList.StatusCode !== 201) {
            triggerAlert(
              "Não foi possível criar a lista... Tente novamente mais tarde!",
            );
            handleCloseModal();
            return;
          }

          const newItemToState = {
            ...newList,
            id: responseList.lista.id_lista,
            author: user.nome,
          };

          setLists((prev) => [newItemToState, ...prev]);
        }

        handleCloseModal();
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
    isModalOpen,
    isModeEdition,
    selectedListToEdit,
    handleAddItem,
    handleDeleteItem,
    isLoading,
    error,
    refreshLists: fetchLists,
  };
}
