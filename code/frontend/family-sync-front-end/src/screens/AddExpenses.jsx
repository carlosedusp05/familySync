import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";
import DefaultButton from "../components/ui/DefaultButton";
import {
  waterIcon,
  homeIcon,
  shoppingIcon,
  lightIcon,
  healthIcon,
  bookIcon,
  mealIcon,
  partyIcon,
} from "../assets";

function AddExpenses() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 items-center justify-center py-12 h-full">
        <LargeCard
          size={"h-[80%] w-[55%]"}
          color="bg-white"
          display={"flex justify-center"}
          not_pop_up={true}
        >
          <div className="w-full min-h-20 flex flex-col  items-center pt-4 shadow-inner gap-5">
            <h1 className="text-4xl font-light">Adicionar gastos</h1>
            <div className="flex justify-center items-end pt-5 w-full -mr-20 gap-4">
              <input
                type="text"
                className="w-[30%] outline-none text-orange text-5xl text-center font-bold border-b-5"
              />
              <h1 className="text-orange text-4xl">BRL</h1>
            </div>
            <div className="w-[70%] h-[60%] bg-yellow-cream rounded-4xl mt-10 flex flex-col items-center py-6">
              <input
                type="text"
                className="w-[70%] rounded-4xl indent-10 outline-none border border-orange text-3xl bg-white p-2"
                placeholder="Procure por seu Icone Aqui..."
              />
              <div className="flex flex-wrap justify-center w-[70%] h-[80%] gap-x-10 gap-y-0 p-8 mt-10">
                <div
                  className="h-25 w-25 border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90"
                >
                  <img
                    src={shoppingIcon}
                    alt="Icone de Shopping"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className="h-25 w-25 border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90"
                >
                  <img
                    src={lightIcon}
                    alt="Icone de Luz"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className="h-25 w-25 border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90"
                >
                  <img
                    src={waterIcon}
                    alt="Icone de Água"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className="h-25 w-25 border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90"
                >
                  <img
                    src={homeIcon}
                    alt="Icone de Home"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className="h-25 w-25 border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90"
                >
                  <img
                    src={healthIcon}
                    alt="Icone de Health"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className="h-25 w-25 border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90"
                >
                  <img
                    src={bookIcon}
                    alt="Icone de Book"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className="h-25 w-25 border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90"
                >
                  <img
                    src={mealIcon}
                    alt="Icone de Almoço"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className="h-25 w-25 border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90"
                >
                  <img
                    src={partyIcon}
                    alt="Icone de Festa"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
            <div className="w-auto h-auto flex justify-center items-center gap-80">
              <DefaultButton
                text="Cancelar"
                another_size="h-12 w-37"
                theme={false}
              />
              <DefaultButton text="Adicionar" another_size="h-12 w-37" />
            </div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default AddExpenses;
