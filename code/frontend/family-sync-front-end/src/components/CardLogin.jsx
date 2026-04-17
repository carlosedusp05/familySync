import IconFamilySync from "./IconFamilySync";
import DefaultTextField from "./DefaultTextField";
import DefaultButton from "./DefaultButton";
import DefaultCard from "./DefaultCard";
import { eyeIcon, emailIcon } from "../assets";

function CardLogin() {
  return (
    <DefaultCard>
      <IconFamilySync is_small={true} />
      <h1 className="text-orange-dark font-bold text-4xl">Login</h1>
      <div className=" h-[40%] flex justify-center items-center flex-wrap">
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

      <div>
        <DefaultButton
          text="Entrar"
          horizontal="100px"
          vertical="16px"
          theme={true}
        />

        <a className="text-orange text-[14px] cursor-pointer">
          Esqueceu a senha?
        </a>
        <DefaultButton
          text="Cadastrar"
          horizontal="84px"
          vertical="16px"
          theme={false}
        />
      </div>
    </DefaultCard>
  );
}

export default CardLogin;
