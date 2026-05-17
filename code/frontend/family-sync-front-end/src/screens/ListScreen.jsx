import MainLayout from "../layouts/MainLayout";
import ListContent from "../components/features/List/ListContent";
import { useList } from "../hooks/useList";
import ModalList from "../components/features/List/ModalList";

function ListScreen() {
  const {
    lists,
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
  } = useList();

  return (
    <MainLayout>
      <ListContent
        lists={lists}
        activeList={activeList}
        setActiveListId={setActiveListId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleItem={toggleItem}
        handleSelectAllItems={handleSelectAllItems}
        toggleFavorite={toggleFavorite}
        handleOpenModal={handleOpenModal}
        handleDeleteList={handleDeleteList}
        handleAddItem={handleAddItem}
        handleDeleteItem={handleDeleteItem}
      />

      <ModalList
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveList}
        data={selectedListToEdit}
        isEdit={isModeEdition}
      />
    </MainLayout>
  );
}

export default ListScreen;
