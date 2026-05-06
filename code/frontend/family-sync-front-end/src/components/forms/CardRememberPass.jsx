import DefaultCard from "../ui/DefaultCard";
import DefaultTextField from "../ui/DefaultTextField";
import DefaultButton from "../ui/DefaultButton";
import { eyeIcon } from "../../assets";
import { useNavigate } from "react-router-dom";

function CardRememberPass() {
  const navigate = useNavigate();

  const prefetchLogin = () => {
    import("../../screens/LoginScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  return (
    <DefaultCard>
      <h1 className="text-orange-dark font-bold text-4xl w-[288px]">
        Esqueci minha senha
      </h1>
      <div className=" h-[60%] flex justify-center items-center flex-wrap gap-6">
        <DefaultTextField placeholder="Código do e-mail" type="text" />
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

      <div className="grid grid-cols-2 gap-23 w-full mt-2 px-2">
        <DefaultButton
          text="Cancelar"
          theme={false}
          border={true}
          onMouseEnter={prefetchLogin}
          onClick={() => navigate("/auth/login")}
        />
        <DefaultButton
          text="Trocar Senha"
          theme={true}
          onMouseEnter={prefetchLogin}
          onClick={() => navigate("/auth/login")}
        />
      </div>
    </DefaultCard>
  );
}

export default CardRememberPass;
