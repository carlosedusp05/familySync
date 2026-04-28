import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";
import DefaultButton from "../components/ui/DefaultButton";
import { useState } from "react";
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

function AddExpenses({ is_edit_expenses }) {
  const [selectedIcon, setIcon] = useState(null);

  const toggleIcon = (id) => {
    setIcon((iconId) => (iconId === id ? null : id));
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 items-center justify-center py-12 h-full">
        <LargeCard
          size={"h-[80%] w-[55%]"}
          display={"flex justify-center"}
          color={"bg-gradient-to-t from-[#F0D7C7]/94 to-white"}
          not_pop_up={true}
        >
          <div className="w-full min-h-20 flex flex-col  items-center pt-8 shadow-inner gap-5">
            <h1 className="text-4xl">
              {is_edit_expenses ? "Editar gastos" : "Adicionar gastos"}
            </h1>
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
              <div className="flex flex-wrap justify-center w-[60%] h-[50%] gap-x-10 gap-y-3 p-8 mt-10">
                <div
                  className={`${
                    selectedIcon === "shopping"
                      ? "bg-[#FF6200]/25"
                      : "bg-transparent"
                  } border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90 grow basis-[calc(25%-2.5rem)] max-w-[25%]`}
                  onClick={() => toggleIcon("shopping")}
                >
                  <img
                    src={shoppingIcon}
                    alt="Icone de Shopping"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className={`${
                    selectedIcon === "light"
                      ? "bg-[#FF6200]/25"
                      : "bg-transparent"
                  } border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90 grow basis-[calc(25%-2.5rem)] max-w-[25%]`}
                  onClick={() => toggleIcon("light")}
                >
                  <img
                    src={lightIcon}
                    alt="Icone de Light"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className={`${
                    selectedIcon === "water"
                      ? "bg-[#FF6200]/25"
                      : "bg-transparent"
                  } border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90 grow basis-[calc(25%-2.5rem)] max-w-[25%]`}
                  onClick={() => toggleIcon("water")}
                >
                  <img
                    src={waterIcon}
                    alt="Icone de Water"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className={`${
                    selectedIcon === "home"
                      ? "bg-[#FF6200]/25"
                      : "bg-transparent"
                  } border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90 grow basis-[calc(25%-2.5rem)] max-w-[25%]`}
                  onClick={() => toggleIcon("home")}
                >
                  <img
                    src={homeIcon}
                    alt="Icone de Home"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className={`${
                    selectedIcon === "health"
                      ? "bg-[#FF6200]/25"
                      : "bg-transparent"
                  } border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90 grow basis-[calc(25%-2.5rem)] max-w-[25%]`}
                  onClick={() => toggleIcon("health")}
                >
                  <img
                    src={healthIcon}
                    alt="Icone de Health"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className={`${
                    selectedIcon === "book"
                      ? "bg-[#FF6200]/25"
                      : "bg-transparent"
                  } border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90 grow basis-[calc(25%-2.5rem)] max-w-[25%]`}
                  onClick={() => toggleIcon("book")}
                >
                  <img
                    src={bookIcon}
                    alt="Icone de Book"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className={`${
                    selectedIcon === "meal"
                      ? "bg-[#FF6200]/25"
                      : "bg-transparent"
                  } border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90 grow basis-[calc(25%-2.5rem)] max-w-[25%]`}
                  onClick={() => toggleIcon("meal")}
                >
                  <img
                    src={mealIcon}
                    alt="Icone de Meal"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div
                  className={`${
                    selectedIcon === "party"
                      ? "bg-[#FF6200]/25"
                      : "bg-transparent"
                  } border-8 border-orange-dark rounded-full p-1 cursor-pointer hover:-translate-y-0.5
                            transition-all active:scale-90 active:brightness-90 grow basis-[calc(25%-2.5rem)] max-w-[25%]`}
                  onClick={() => toggleIcon("party")}
                >
                  <img
                    src={partyIcon}
                    alt="Icone de Party"
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
              <DefaultButton
                text={is_edit_expenses ? "Confirmar" : "Adicionar"}
                another_size="h-12 w-37"
              />
            </div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default AddExpenses;
