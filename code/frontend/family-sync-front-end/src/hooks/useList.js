import { useState, useMemo, useCallback, useEffect } from "react";
import { formatToBRL } from "../utils/formatters";

const INITIAL_LISTS = [];
const STORAGE_KEY = "@FamilySync:list";

export function useList() {
  const [lists, setLists] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_LISTS;
  });

  const [activeListId, setActiveListId] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : INITIAL_LISTS;
    return parsed[0]?.id || null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListToEdit, setSelectedListToEdit] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

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
    (itemData) => {
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
    (data) => {
      setLists((prev) => {
        if (selectedListToEdit) {
          return prev.map((list) =>
            list.id === selectedListToEdit.id
              ? { ...list, name: data.name, items: data.items }
              : list,
          );
        } else {
          const newList = {
            id: Date.now(),
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
    [selectedListToEdit, handleCloseModal],
  );

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
  };
}
