import React from "react";
import IconFamilySync from "../icons/IconFamilySync";
import DefaultTextField from "../ui/DefaultTextField";
import DefaultButton from "../ui/DefaultButton";
import DefaultCard from "../ui/DefaultCard";
import { eyeIcon, emailIcon } from "../../assets";
import { useNavigate } from "react-router-dom";
import ErrorForms from "../ui/ErrorForms";

function CardLogin({
  setEmail,
  setSenha,
  handleSubmit,
  erro,
  errosCampos,
  setErrosCampos,
}) {
  const navigate = useNavigate();

  const prefetchLoggedIn = () => {
    import("../../screens/StartScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const prefetchRememberPass = () => {
    import("../../screens/RememberPassScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const prefetchRegister = () => {
    import("../../screens/RegisterScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  return (
    <DefaultCard h={"h-[50%]"}>
      <IconFamilySync />
      <h2 className="text-orange-dark font-bold text-4xl">Login</h2>

      <div className="w-[88%] flex flex-col gap-6 justify-center items-center">
        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
              if (errosCampos?.email) {
                setErrosCampos((prev) => ({ ...prev, email: "" }));
              }
            }}
            type="text"
            alt="Input Email"
            src={emailIcon}
            hasError={errosCampos?.email ? true : false}
          />
          {errosCampos?.email && (
            <span className="text-red-500 text-sm px-2">
              {errosCampos.email}
            </span>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            placeholder="Senha"
            onChange={(e) => {
              setSenha(e.target.value);
              if (errosCampos?.senha) {
                setErrosCampos((prev) => ({ ...prev, senha: "" }));
              }
            }}
            type="password"
            src={eyeIcon}
            alt="Input Senha"
            isPassword={true}
            hasError={errosCampos?.senha ? true : false}
          />
          {errosCampos?.senha && (
            <span className="text-red-500 text-sm px-2">
              {errosCampos.senha}
            </span>
          )}
        </div>
      </div>

      <div className="flex w-[40%] flex-col gap-1 mt-2">
        <DefaultButton
          text="Entrar"
          theme={true}
          onMouseEnter={prefetchLoggedIn}
          onClick={handleSubmit}
        />

        <a
          className="text-orange text-[14px] cursor-pointer"
          onMouseEnter={prefetchRememberPass}
          onClick={() => navigate("/auth/recovery")}
        >
          Esqueceu a senha?
        </a>

        <DefaultButton
          text="Cadastrar"
          theme={false}
          border={true}
          onMouseEnter={prefetchRegister}
          onClick={() => navigate("/auth/register")}
        />
      </div>
    </DefaultCard>
  );
}

export default CardLogin;
