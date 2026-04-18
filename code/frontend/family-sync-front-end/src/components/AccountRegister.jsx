import DefaultCard from "./DefaultCard";
import IconPerfil from "./IconPerfil";
import DefaultButton from "./DefaultButton";
import MultTextField from "./MultTextField";
import { eyeIcon, plusIcon } from "../assets";

function AccountRegister() {
  return (
    <DefaultCard>
      <div className="flex justify-center items-center">
        <div className="relative">
          <IconPerfil is_orange={true} />

          <div className="absolute -bottom-2 -right-2 flex items-center justify-center bg-orange p-2 rounded-[50%]">
            <img className="h-7" src={plusIcon} alt="Adicionar Imagem" />
          </div>
        </div>
      </div>
      <h1 className="text-orange text-3xl -mt-6">Eu</h1>
      <div className=" w-full flex justify-center items-center flex-wrap gap-6">
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

      <div className="flex items-center justify-center px-10 h-14 gap-[25%] w-full">
        <DefaultButton text="Cancelar" theme={false} border={true} />
        <DefaultButton text="Cadastrar" theme={true} />
      </div>
    </DefaultCard>
  );
}

export default AccountRegister;
