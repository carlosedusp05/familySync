import DefaultCard from "./DefaultCard";
import IconPerfil from "./IconPerfil";
import DefaultButton from "./DefaultButton";
import MultTextField from "./MultTextField";
import { eyeIcon } from "../assets";

function AccountRegister() {
  return (
    <DefaultCard slim_card={true}>
      <div className="flex justify-center items-center">
        <div className="relative">
          <IconPerfil is_orange={true} />

          <div className="absolute -bottom-2 -right-2 flex items-center justify-center">
            <DefaultButton text="+" theme={true} most_radius={true} />
          </div>
        </div>
      </div>
      <h1 className="text-orange font-bold text-4xl">Eu</h1>
      <div className=" w-[80%] flex justify-center items-center flex-wrap gap-6">
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

      <div className="flex w-[80%] px-10 h-14 gap-30">
        <DefaultButton text="Cancelar" theme={false} border={true} />
        <DefaultButton text="Cadastrar" theme={true} />
      </div>
    </DefaultCard>
  );
}

export default AccountRegister;
