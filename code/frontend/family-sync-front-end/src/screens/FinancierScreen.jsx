import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import { editIcon, dollarIcon, sortDownIcon } from "../assets";

function FinancierScreen() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 items-center justify-center py-12 h-full">
        <LargeCard
          size={"h-[70%] w-[60%]"}
          color="bg-gray"
          display={"flex justify-center"}
        >
          <div className="w-full min-h-20 flex flex-col  items-center bg-gray-light pt-10 rounded-2xl shadow-inner">
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

            <div className="h-[80%] w-full my-5">
              <div className="w-full flex items-center justify-between px-50">
                <span className="text-3xl text-orange">Dia</span>
                <span className="text-3xl text-orange">Semana</span>
                <span className="underline decoration-5 text-3xl text-orange font-bold">
                  Mês
                </span>
                <span className="text-3xl text-orange">Ano</span>
              </div>
              <div className="w-full h-[90%] mt-[2%] flex items-center flex-row px-15 gap-4">
                <li className="text-[20px] flex flex-col gap-4 pb-8">
                  <ol>5000</ol>
                  <ol>5000</ol>
                  <ol>5000</ol>
                  <ol>5000</ol>
                  <ol>5000</ol>
                  <ol>5000</ol>
                  <ol>5000</ol>
                  <ol>5000</ol>
                  <ol>5000</ol>
                  <ol>5000</ol>
                </li>
                <div className=" w-full h-full flex items-end justify-between px-30 -mt-14">
                  <div className="w-[10%] h-full flex flex-col items-center justify-end">
                    <div className="w-full h-[50%] bg-[linear-gradient(to_right,#FD8338_0%,#FD8338_63%,#994D1F_100%)] shadow-lg/20"></div>
                    <h2 className="text-2xl">água</h2>
                  </div>
                  <div className="w-[10%] h-full flex flex-col items-center justify-end">
                    <div className="w-full h-[70%] bg-[linear-gradient(to_right,#FD8338_0%,#FD8338_63%,#994D1F_100%)] shadow-lg/20"></div>
                    <h2 className="text-2xl">água</h2>
                  </div>
                  <div className="w-[10%] h-full flex flex-col items-center justify-end">
                    <div className="w-full h-[80%] bg-[linear-gradient(to_right,#FD8338_0%,#FD8338_63%,#994D1F_100%)] shadow-lg/20"></div>
                    <h2 className="text-2xl">água</h2>
                  </div>
                  <div className="w-[10%] h-full flex flex-col items-center justify-end">
                    <div className="w-full h-[30%] bg-[linear-gradient(to_right,#FD8338_0%,#FD8338_63%,#994D1F_100%)] shadow-lg/20"></div>
                    <h2 className="text-2xl">água</h2>
                  </div>
                  <div className="w-[10%] h-full flex flex-col items-center justify-end">
                    <div className="w-full h-[10%] bg-[linear-gradient(to_right,#FD8338_0%,#FD8338_63%,#994D1F_100%)] shadow-lg/20"></div>
                    <h2 className="text-2xl">água</h2>
                  </div>
                  <div className="w-[10%] h-full flex flex-col items-center justify-end">
                    <div className="w-full h-[40%] bg-[linear-gradient(to_right,#FD8338_0%,#FD8338_63%,#994D1F_100%)] shadow-lg/20"></div>
                    <h2 className="text-2xl">água</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LargeCard>
        <div className="w-auto h-auto flex justify-center items-center gap-80">
          <DefaultButton text="Editar" another_size="h-12 w-37" />
          <DefaultButton text="Incluir" another_size="h-12 w-37" />
        </div>
      </div>
    </MainLayout>
  );
}

export default FinancierScreen;
