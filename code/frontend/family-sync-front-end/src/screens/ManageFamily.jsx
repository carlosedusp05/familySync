import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import InputWhite from "../components/ui/InputWhite";
import IconPerfil from "../components/icons/IconPerfil";
import MultFamiliars from "../components/ui/MultiFamiliars";
import { pencilTerracotaIcon, saveIcon } from "../assets";
import { useRef, useState } from "react";

function ManageFamily() {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileSelecionado, setFileSelecionado] = useState(null);

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileSelecionado(file);

    const reader = new FileReader();
    reader.onloadend = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImagem = () => {
    setPreview(null);
    setFileSelecionado(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 items-center justify-center py-15 h-full">
        <div className="w-[80%] h-full flex gap-8">
          <div className="max-h-full flex-1 bg-yellow-cream rounded-[60px] flex flex-col items-center pt-20 text-center text-4xl font-bold text-orange gap-5">
            <div className="relative w-[48%] h-[35%] aspect-square">
              <div className="w-full h-full bg-white border-4 border-orange rounded-full flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={handleButtonClick}
                  />
                ) : (
                  <IconPerfil
                    is_family_icon={true}
                    another_size={"h-full w-full"}
                    onClickNew={handleButtonClick}
                  />
                )}
              </div>
              <div className="absolute -right-2 -bottom-2">
                <DefaultButton
                  onClick={preview ? removeImagem : handleButtonClick}
                  another_padding={"px-0 pb-2"}
                  another_size={"h-20 w-20"}
                  another_text_size={"text-7xl"}
                  most_radius={true}
                  text={preview ? "×" : "+"}
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
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

          {/* COLUNA DA DIREITA: FORMULÁRIO E CONVITE */}
          <div className="flex justify-between flex-col flex-2 gap-10 px-4">
            {/* Card de Informações da Família */}
            <div className="bg-yellow-cream rounded-[60px] px-15 pt-10 pb-25 relative h-fit">
              <div className="w-full text-orange text-5xl font-bold flex items-center py-14 gap-3">
                <h1>Nome da familia</h1>
                <img
                  src={pencilTerracotaIcon}
                  alt="Icone do pincel"
                  className="w-10 h-10 opacity-70 transition-colors active:scale-95 cursor-pointer"
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
                className="absolute -top-8 -right-8 cursor-pointer transition-all duration-300 ease-out active:scale-90"
              />
            </div>

            {/* Seção de Convite */}
            <div className="flex items-center justify-center bg-yellow-cream rounded-[35px] mx-10 gap-5 px-8 py-6">
              <div className="flex items-center justify-center h-15 w-[85%] bg-white shadow-lg rounded-2xl px-6">
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
