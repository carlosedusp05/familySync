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
        data={listProps.selectedListToEdit}
        isEdit={listProps.isModeEdition}
      />
    </MainLayout>
  );
}

export default ListScreen;
