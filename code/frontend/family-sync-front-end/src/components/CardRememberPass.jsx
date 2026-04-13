import DefaultCard from "./DefaultCard";
import DefaultTextField from "./DefaultTextField";
import DefaultButton from "./DefaultButton";
import { eyeIcon } from "../assets";

function CardRememberPass() {
  return (
    <DefaultCard>
      <h1 className="text-orange-dark font-bold text-4xl">
        Esqueci minha senha
      </h1>
      <div className=" h-[60%] flex justify-center items-center flex-wrap">
        <DefaultTextField
          placeholder="Código do e-mail"
          type="text"
          src={eyeIcon}
          alt="Input Código do e-mail"
        />
        <DefaultTextField
          placeholder="Senha"
          type="text"
          src={eyeIcon}
          alt="Input Senha"
        />
        <DefaultTextField
          placeholder="Confirme a senha"
          type="text"
          src={eyeIcon}
          alt="Input Confirme a senha"
        />
      </div>

      <div className="flex gap-18 ">
        <DefaultButton
          text="Cancelar"
          horizontal="60px"
          vertical="16px"
          theme={false}
        />
        <DefaultButton
          text="Trocar Senha"
          horizontal="40px"
          vertical="16px"
          theme={true}
        />
      </div>
    </DefaultCard>
  );
}

export default CardRememberPass;
