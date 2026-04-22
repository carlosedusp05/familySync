import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";

function ListaScreen() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center pb-10 pt-20">
        <LargeCard color={"bg-orange"}></LargeCard>
      </div>
    </MainLayout>
  );
}

export default ListaScreen;
