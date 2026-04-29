import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";
import { familyIcon, plusIcon } from "../assets/index";
import DefaultButton from "../components/ui/DefaultButton";
import InputAddFamily from "../components/ui/InputAddFamily";
import { useRef } from "react";

function AddFamilyScreen() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  return (
    <MainLayout>
      <div className="w-full h-full flex justify-center items-center">
        <LargeCard
          color={"bg-yellow-light"}
          p={"px-50"}
          size={"h-[80%] w-[75%]"}
        >
          <div className="h-full w-full flex items-center justify-between">
            <div className="w-110 h-110 relative rounded-full border-2 border-orange flex items-center justify-center bg-white">
              <img className="h-[60%]" src={familyIcon} alt="Family Icon" />
              <div className="absolute bottom-3 right-1 flex items-center justify-center rounded-[50%] cursor-pointer">
                <input
                  className="absolute opacity-0 w-full h-full cursor-pointer hidden"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) console.log("Arquivo selecionado:", file);
                  }}
                />
                <DefaultButton
                  onClick={handleButtonClick}
                  another_padding={"px-0 pb-2"}
                  another_size={"h-25 w-25"}
                  another_text_size={"text-7xl"}
                  most_radius={true}
                  text="+"
                />
              </div>
            </div>
            <div className="flex flex-col gap-8 w-[50%] justify-center">
              <div className="flex flex-col gap-3">
                <InputAddFamily
                  type="text"
                  placeholder="Nome da Familia"
                  w="w-full"
                />
                <InputAddFamily
                  type="text"
                  placeholder="Telefone Residencial"
                  w="w-full"
                />
                <div className="flex gap-3 w-full">
                  <InputAddFamily type="text" placeholder="UF" w="w-[30%]" />
                  <InputAddFamily type="text" placeholder="CEP" w="w-[70%]" />
                </div>
                <div className="flex gap-3 w-full">
                  <InputAddFamily
                    type="text"
                    placeholder="Cidade"
                    w="w-[60%]"
                  />
                  <InputAddFamily
                    type="text"
                    placeholder="Bairro"
                    w="w-[40%]"
                  />
                </div>
                <InputAddFamily
                  type="text"
                  placeholder="Logradouro"
                  w="w-full"
                />
                <div className="flex gap-3 w-full">
                  <InputAddFamily
                    type="text"
                    placeholder="Número"
                    w="w-[40%]"
                  />
                  <InputAddFamily
                    type="text"
                    placeholder="Complemento (Opcional)"
                    w="w-[60%]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="w-full bg-brown-dark rounded-2xl flex px-5 py-3  h-20 gap-3">
                  <p className="py-2 px-5 bg-orange text-brown-dark rounded-2xl w-[60%] flex items-center justify-center text-2xl">
                    Nome do usuário
                  </p>
                  <DefaultButton
                    text="Convidar"
                    another_text_size={"text-2xl"}
                    another_size={"w-[40%]"}
                  />
                </div>
                <div className="w-full flex justify-between">
                  <DefaultButton
                    text="Cancelar"
                    another_text_size={"text-2xl"}
                    another_size={"w-[40%]"}
                    theme={false}
                  />
                  <DefaultButton
                    text="Confirmar"
                    another_text_size={"text-2xl"}
                    another_size={"w-[40%]"}
                  />
                </div>
              </div>
            </div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default AddFamilyScreen;
