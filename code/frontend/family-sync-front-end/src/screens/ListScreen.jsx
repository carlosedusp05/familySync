import MainLayout from "../layouts/MainLayout";
import ListContent from "../components/features/List/ListContent";
import { useList } from "../hooks/useList";
import ModalList from "../components/features/List/ModalList";

function ListScreen() {
  const listProps = useList();

  return (
    <MainLayout warning={listProps.warning} showWarning={listProps.showWarning}>
      <ListContent {...listProps} />

      <ModalList
        isOpen={listProps.isModalOpen}
        onClose={listProps.handleCloseModal}
        onSave={listProps.handleSaveList}
        onSaveEdit={listProps.handleSaveListEdition}
        data={listProps.selectedListToEdit}
        isEdit={listProps.isModeEdition}
        onDeleteItem={listProps.handleDeleteItem}
      />
    </MainLayout>
  );
}

export default ListScreen;
