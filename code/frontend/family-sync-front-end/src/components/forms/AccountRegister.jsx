import DefaultCard from "../ui/DefaultCard";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import MultTextField from "../ui/MultTextField";
import { eyeIcon, plusIcon } from "../../assets";
import { useRef } from "react";

function AccountRegister() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  return (
    <DefaultCard>
      <div className="w-30 h-30 relative rounded-full border-2 border-orange flex items-center justify-center bg-white">
        <IconPerfil is_white_backgroud={true} another_size={"h-70%"} />
        <div className="absolute -bottom-3 -right-3 flex items-center justify-center rounded-[50%] cursor-pointer">
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
            another_padding={"px-0 pb-1"}
            another_size={"h-12 w-12"}
            another_text_size={"text-3xl"}
            most_radius={true}
            text="+"
          />
        </div>
      </div>
      <h1 className="text-orange text-3xl -mt-6">Eu</h1>
      <div className=" w-[90%] flex justify-center items-center flex-wrap gap-5">
        <MultTextField
          text_fields={[
            { placeholder: "Nome", type: "text" },
            { placeholder: "Email", type: "email" },
            { placeholder: "CPF", type: "text" },
            { placeholder: "Data Nascimento", type: "text" },
            {
              placeholder: "Senha",
              type: "text",
              src: eyeIcon,
              alt: "Input Senha",
            },
            {
              placeholder: "Confirme a senha",
              type: "text",
              src: eyeIcon,
              alt: "Input Confirme a senha",
            },
          ]}
        />
      </div>

      <div className="flex items-center justify-center  h-14 gap-[25%] w-[90%]">
        <DefaultButton text="Cancelar" theme={false} border={true} />
        <DefaultButton text="Cadastrar" theme={true} />
      </div>
    </DefaultCard>
  );
}

export default AccountRegister;
