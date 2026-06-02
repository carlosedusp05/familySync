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
              name: item.nome || item.nome_item || item.name || "Item sem nome",
              price: parseFloat(item.valor_unitario) || 0,
              units: item.quantidade || 1,
              isSelected: item.comprado === 1,
            }));

            allMappedLists.push({
              id: lista.id_lista,
              nome: lista.nome_lista || lista.nome || "Lista sem nome",
              name: lista.nome_lista || lista.nome || "Lista sem nome",
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
    (itemId) => {
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

  const handleAddItem = useCallback(
    async (itemData) => {
      if (!activeListId) return;

      const newItem = {
        id: Date.now() + Math.random(),
        name: itemData.name || "Sem nome",
        price: parseFloat(itemData.price) || 0,
        units: parseInt(itemData.units) || 1,
        isSelected: false,
      };

      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id !== activeListId) return list;
          return {
            ...list,
            items: [...(list.items || []), newItem],
          };
        }),
      );
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

  const handleDeleteList = useCallback(
    (listId) => {
      setLists((prev) => prev.filter((list) => list.id !== listId));
      if (activeListId === listId) setActiveListId(null);
    },
    [activeListId],
  );

  const handleDeleteItem = useCallback(
    (itemId) => {
      if (!activeListId) return;

      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id !== activeListId) return list;
          return {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
          };
        }),
      );
    },
    [activeListId],
  );

  const handleSaveList = useCallback(
    async (data) => {
      if (selectedListToEdit) {
        setLists((prev) =>
          prev.map((list) =>
            list.id === selectedListToEdit.id
              ? { ...list, name: data.name, items: data.items }
              : list,
          ),
        );
      } else {
        const newList = {
          id: Date.now(),
          id_usuario: user.id,
          nome: data.name,
          isFavorite: false,
          items: data.items || [],
        };

        console.log(newList);

        const response = await listService.createList(newList);

        console.log(response);

        setLists((prev) => [newList, ...prev]);
      }

      handleCloseModal();
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
