import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import { editIcon, dollarIcon, sortDownIcon } from "../assets";

function FinancierScreen() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center py-12 h-full">
        <LargeCard
          size={"h-[80%] w-[50%]"}
          color="bg-gray"
          display={"flex justify-center"}
        >
          <div className="w-full min-h-20 flex flex-col  items-center bg-gray-light p-10 rounded-2xl shadow-inner">
            <div className="flex items-center gap-2">
              <img
                src={dollarIcon}
                alt="Dinheiro"
                className="w-8 h-8 object-contain"
              />
              <span className="text-amber-900 text-2xl font-medium tracking-wide">
                Total
              </span>
              <img
                src={sortDownIcon}
                alt="Expandir"
                className="w-6 h-6 opacity-70 transition-colors active:scale-95"
              />
            </div>

            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-orange-500 font-bold text-3xl">R$ 5.000</h2>
              <button className="p-1 transition-colors active:scale-95">
                <img
                  src={editIcon}
                  alt="Editar valor"
                  className="w-8 h-8"
                  draggable={false}
                />
              </button>
            </div>

            <div className="h-[70%] w-[80%] bg-blue-700 p-20 my-5"></div>
            <div className="w-auto h-auto flex justify-center items-center gap-80">
              <DefaultButton text="Editar" another_size="h-12 w-30" />
              <DefaultButton text="Incluir" another_size="h-12 w-30" />
            </div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default FinancierScreen;
