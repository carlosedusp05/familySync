import IconFamilySync from "../icons/IconFamilySync";
import DefaultTextField from "../ui/DefaultTextField";
import DefaultButton from "../ui/DefaultButton";
import DefaultCard from "../ui/DefaultCard";
import { eyeIcon, emailIcon } from "../../assets";

function CardLogin() {
  return (
    <DefaultCard h={"h-[50%]"}>
      <IconFamilySync is_small={true} />
      <h2 className="text-orange-dark font-bold text-6xl">Login</h2>
      <div className=" w-[88%] flex flex-col gap-8 justify-center items-center">
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

      <div className="flex w-[40%] flex-col gap-1">
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
