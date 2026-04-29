import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import InputWhite from "../components/ui/InputWhite";
import IconPerfil from "../components/icons/IconPerfil";
import MultFamiliars from "../components/ui/MultiFamiliars";
import { pencilTerracotaIcon, saveIcon } from "../assets";
import { useRef } from "react";

function ManageFamily() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 items-center justify-center py-12 h-full">
        <div className="w-[80%] h-full flex gap-8">
          <div className="h-full flex-1 bg-yellow-cream rounded-[60px] flex flex-col items-center pt-20 text-center text-5xl font-bold text-orange gap-5">
            <div className="relative w-[45%] aspect-square bg-white border-4 border-orange rounded-full flex items-center justify-center">
              <IconPerfil
                is_family_icon={true}
                another_size={"h-full w-full"}
              />

              <div className="absolute right-0 bottom-0">
                <DefaultButton
                  onClick={handleButtonClick}
                  another_padding={"px-0 pb-2"}
                  another_size={"h-20 w-20"}
                  another_text_size={"text-7xl"}
                  most_radius={true}
                  text="+"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) console.log("Arquivo selecionado:", file);
                  }}
                />
              </div>
            </div>
            <h1>Membros</h1>
            <MultFamiliars
              familiars={[
                { id: 1, name: "João Pedro", degree_of_relatives: "Pai" },
                { id: 2, name: "Maria Alice", degree_of_relatives: "Mãe" },
                { id: 3, name: "Lucas Gabriel", degree_of_relatives: "Filho" },
                { id: 4, name: "Ana Beatriz", degree_of_relatives: "Filha" },
                { id: 5, name: "Ricardo Alves", degree_of_relatives: "Avô" },
                { id: 6, name: "Sônia Maria", degree_of_relatives: "Avó" },
                { id: 7, name: "Bruno Henrique", degree_of_relatives: "Tio" },
                { id: 8, name: "Carla Fernanda", degree_of_relatives: "Tia" },
                { id: 9, name: "Felipe Augusto", degree_of_relatives: "Primo" },
                { id: 10, name: "Juliana Costa", degree_of_relatives: "Prima" },
              ]}
            />
          </div>
          <div className=" flex flex-col flex-2 gap-10 px-4">
            <div className="flex-5 bg-yellow-cream rounded-[60px] px-15 pt-10 relative">
              <div className="w-full text-orange text-6xl font-bold flex items-center p-14 gap-3">
                <h1>Nome da familia</h1>
                <img
                  src={pencilTerracotaIcon}
                  alt="Icone do pincel terracota"
                  className="w-14 h-14 opacity-70 transition-colors active:scale-95"
                />
              </div>
              <div className="flex flex-wrap gap-5">
                <InputWhite text={"00000-000"} styleFlex={"flex-1"} />
                <InputWhite text={"Cidade"} styleFlex={"flex-1"} />

                <div className="w-full flex gap-5">
                  <InputWhite
                    text={"UF"}
                    styleFlex={"w-20 flex-shrink-0 text-center"}
                  />
                  <InputWhite text={"Bairro"} styleFlex={"flex-1"} />
                </div>
                <InputWhite text={"Logradouro"} styleFlex={"w-full"} />
                <InputWhite text={"Número"} styleFlex={"flex-1"} />
                <InputWhite text={"Complemento"} styleFlex={"flex-1"} />
              </div>
              <img
                src={saveIcon}
                alt="Icone de save"
                className="absolute -top-8 -right-8 cursor-pointer
                transition-all duration-300 ease-out 
                active:scale-90 active:rotate-0"
              />
            </div>

            <div className="flex flex-1 items-center justify-center bg-yellow-cream rounded-[35px] mx-20 gap-5 px-8">
              <div className="flex-4 flex items-center justify-center h-15 w-[85%] bg-white shadow-lg rounded-2xl px-6">
                <input
                  type="text"
                  placeholder="Digite o nome de usuário..."
                  className="flex-1 text-3xl text-black outline-none indent-5"
                />
              </div>
              <DefaultButton
                text="convidar"
                another_text_size={"text-[25px]"}
                another_size={"w-40"}
                another_padding={"py-3"}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ManageFamily;
