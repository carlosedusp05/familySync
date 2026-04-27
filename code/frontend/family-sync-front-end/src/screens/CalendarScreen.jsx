import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import ItemEvents from "../components/ui/ItemEvents";

function FinancierScreen() {
  return (
    <MainLayout>
      <div className="h-full flex w-full">
        {/* Div Calendário */}
        <div className="w-[50%] h-full flex flex-col p-30 gap-7">
          <h2 className="text-5xl text-white font-bold">Calendário</h2>
          {/* <div className="flex rounded-2xl bg-yellow-light w-[85%] h-[80%]  shadow-inner"></div> */}
          <LargeCard
            color={"bg-yellow-light border border-terracota"}
            p={"p-20"}
            size={"h-[80%] w-[85%]"}
          ></LargeCard>
          <ItemEvents />
        </div>

        {/* Div Eventos */}
        <div className="w-[50%] h-full flex p-30 justify-center">
          <h2 className="text-5xl text-white font-bold">Eventos Marcados</h2>
          <div className="flex gap-5"></div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FinancierScreen;
