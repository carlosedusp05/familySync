import { useState, useMemo, useCallback, useEffect } from "react";
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

  const idFamilia = sessionStorage.getItem("@FamilySync:family:id");

  const fetchLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await listService.getListsByFamily(idFamilia);

      console.log(response);

      if (response?.StatusCode === 200) {
        const { usuarios, listas, items } = response.Response;

        const mappedLists = listas.map((lista) => {
          const authorUser = usuarios.find(
            (u) => u.id_usuario === lista.id_usuario,
          );
          const authorName = authorUser
            ? authorUser.nome_usuario
            : "Desconhecido";

          const listItems = items
            .filter((item) => item.id_lista === lista.id_lista)
            .map((item) => ({
              id: item.id_item,
              name: item.nome_item,
              price: parseFloat(item.valor_unitario) || 0,
              units: item.quantidade || 1,
              isSelected: item.comprado === 1,
            }));

          return {
            id: lista.id_lista,
            name: lista.nome,
            author: authorName,
            isFavorite: false,
            items: listItems,
            id_familia: lista.id_familia,
            id_usuario: lista.id_usuario,
          };
        });

        setLists(mappedLists);

        setActiveListId((currentId) => {
          if (currentId) return currentId;
          return mappedLists.length > 0 ? mappedLists[0].id : null;
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
        list.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }, [lists, searchQuery]);

  const activeList = useMemo(() => {
    return computedLists.find((list) => list.id === activeListId) || null;
  }, [computedLists, activeListId]);

  // --- FUNÇÕES DE MUTAÇÃO (C.R.U.D) ---
  // Nota: Estas funções atualizam o estado local para resposta instantânea (Optimistic UI),
  // mas você precisará adicionar as chamadas de API (PUT, POST, DELETE) dentro delas.

  const toggleItem = useCallback(
    (itemId) => {
      // TODO: Adicionar chamada API para atualizar status `comprado` (0 ou 1) do item

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

    // TODO: Adicionar chamada API para atualizar status de todos os itens da lista

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
    (itemData) => {
      if (!activeListId) return;

      // TODO: Adicionar chamada API POST para criar o item no back-end
      // E usar o `id_item` retornado pelo back-end ao invés do Date.now()

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
    // TODO: Se for salvar favoritos no banco, adicionar chamada API PUT aqui
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, isFavorite: !list.isFavorite } : list,
      ),
    );
  }, []);

  const handleDeleteList = useCallback(
    (listId) => {
      // TODO: Adicionar chamada API DELETE para a lista
      setLists((prev) => prev.filter((list) => list.id !== listId));
      if (activeListId === listId) setActiveListId(null);
    },
    [activeListId],
  );

  const handleDeleteItem = useCallback(
    (itemId) => {
      if (!activeListId) return;

      // TODO: Adicionar chamada API DELETE para o item específico
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
    (data) => {
      // TODO: Adicionar chamada API POST (se nova lista) ou PUT (se edição)
      setLists((prev) => {
        if (selectedListToEdit) {
          return prev.map((list) =>
            list.id === selectedListToEdit.id
              ? { ...list, name: data.name, items: data.items }
              : list,
          );
        } else {
          const newList = {
            id: Date.now(), // Substituir pelo ID que retornar do POST
            name: data.name,
            author: "Você",
            isFavorite: false,
            items: data.items || [],
          };
          return [newList, ...prev];
        }
      });
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
    isLoading, // Exportado para exibir skeletons/spinners na UI
    error,
    refreshLists: fetchLists, // Exportado caso precise recarregar manualmente
  };
}
