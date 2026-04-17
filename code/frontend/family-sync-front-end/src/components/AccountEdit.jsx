import DefaultCard from "./DefaultCard";
import IconPerfil from "./IconPerfil";
import DefaultButton from "./DefaultButton";
import MultTextField from "./MultTextField";
import { editIcon } from "../assets";

function AccountEdit() {
  return (
    <DefaultCard slim_card={true}>
      <div className="relative flex justify-center w-fit mx-auto">
        <IconPerfil is_orange={true} />

        <div className="absolute -bottom-2 -right-2">
          <DefaultButton
            text="+"
            horizontal="13.5px"
            vertical="0px"
            theme={true}
            most_radius={true}
          />
        </div>
      </div>
      <h1 className="text-orange font-bold text-4xl">Eu</h1>
      <div className=" h-[90%] flex justify-center items-center flex-wrap gap-6">
        <MultTextField
          text_fields={[
            {
              placeholder: "Nome",
              type: "text",
              src: editIcon,
              alt: "Icon edit Nome",
            },
            {
              placeholder: "Email",
              type: "email",
              src: editIcon,
              alt: "Icon edit Email",
            },
            {
              placeholder: "CPF",
              type: "text",
              src: editIcon,
              alt: "Icon edit CPF",
            },
            {
              placeholder: "Data Nascimento",
              type: "text",
              src: editIcon,
              alt: "Icon edit Data Nascimento",
            },
            {
              placeholder: "Senha",
              type: "text",
              src: editIcon,
              alt: "Icon edit Senha",
            },
            {
              placeholder: "Familia",
              type: "text",
              src: editIcon,
              alt: "Icon edit Familia",
            },
          ]}
        />
      </div>

      <div className="flex gap-18 ">
        <DefaultButton
          text="Cancelar"
          horizontal="60px"
          vertical="16px"
          theme={false}
          border={true}
        />
        <DefaultButton
          text="Confirmar"
          horizontal="56.5px"
          vertical="16px"
          theme={true}
        />
      </div>
    </DefaultCard>
  );
}

export default AccountEdit;
