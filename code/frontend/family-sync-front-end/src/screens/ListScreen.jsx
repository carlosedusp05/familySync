import MainLayout from "../layouts/MainLayout";
import ListContent from "../components/features/List/ListContent";
import { useList } from "../hooks/useList";
import ModalList from "../components/features/List/ModalList";

function ListScreen() {
  const listProps = useList();

  return (
    <MainLayout>
      <ListContent {...listProps} />

      <ModalList {...listProps} />
    </MainLayout>
  );
}

export default ListScreen;
