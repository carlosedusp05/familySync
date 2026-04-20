import IconFamilySync from "../icons/IconFamilySync";
import DefaultTextField from "../ui/DefaultTextField";
import DefaultButton from "../ui/DefaultButton";
import DefaultCard from "../ui/DefaultCard";
import { eyeIcon, emailIcon } from "../../assets";

function CardLogin() {
  return (
    <DefaultCard>
      <IconFamilySync is_small={true} />
      <h1 className="text-orange-dark font-bold text-4xl">Login</h1>
      <div className=" h-[70%] flex gap-10 justify-center items-center flex-wrap">
        <DefaultTextField
          placeholder="Email"
          type="text"
          alt="Input Email"
          src={emailIcon}
        />
        <DefaultTextField
          placeholder="Senha"
          type="text"
          src={eyeIcon}
          alt="Input Senha"
        />
      </div>

      <div className="flex  flex-col gap-1">
        <DefaultButton text="Entrar" theme={true} />

        <a className="text-orange text-[14px] cursor-pointer">
          Esqueceu a senha?
        </a>
        <DefaultButton text="Cadastrar" theme={false} border={true} />
      </div>
    </DefaultCard>
  );
}

export default CardLogin;
