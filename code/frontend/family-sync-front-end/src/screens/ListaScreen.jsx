import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";

function ListaScreen() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center py-12 h-full">
        <LargeCard
          max_shadow={true}
          color="bg-yellow-light"
          not_pop_up={true}
          size={"h-full w-[80%]"}
          p={"pt-[43px] px-[60px]"}
        >
          <div className="h-full w-[30%] border-r-2 border-white">
            <h1 className="text-orange-dark text-[40px] font-bold">
              Nome da Lista
            </h1>
            <h1 className="text-brown-dark text-[16px]">
              Fulado, Ciclano, Carlos, Eduardo...
            </h1>
            <div className="h-[60%] w-[80%] bg-brown-dark rounded-2xl"></div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default ListaScreen;
