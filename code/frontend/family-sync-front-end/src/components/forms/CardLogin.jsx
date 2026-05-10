import React, { useState } from "react";
import IconFamilySync from "../icons/IconFamilySync";
import DefaultTextField from "../ui/DefaultTextField";
import DefaultButton from "../ui/DefaultButton";
import DefaultCard from "../ui/DefaultCard";
import { eyeIcon, closedEye, emailIcon } from "../../assets";
import { useNavigate } from "react-router-dom";

function CardLogin({
  email,
  senha,
  setEmail,
  setSenha,
  handleSubmit,
  erro,
  errosCampos,
  setErrosCampos,
}) {
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const togglePasswordVisibility = () => {
    setMostrarSenha(!mostrarSenha);
  };

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
    <DefaultCard h={"h-fit"}>
      <IconFamilySync />
      <h2 className="text-orange-dark font-bold text-4xl">Login</h2>

      <div className="w-[88%] flex flex-col gap-6 justify-center items-center">
        {/* Campo de Email */}
        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errosCampos?.email) {
                setErrosCampos((prev) => ({ ...prev, email: "" }));
              }
            }}
            type="text"
            alt="Input Email"
            src={emailIcon}
            hasError={!!errosCampos?.email}
            maxLength={100}
          />
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              errosCampos?.email
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <span className="overflow-hidden text-red-500 text-sm px-2">
              {errosCampos?.email}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            placeholder="Senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              if (errosCampos?.senha) {
                setErrosCampos((prev) => ({ ...prev, senha: "" }));
              }
            }}
            type={mostrarSenha ? "text" : "password"}
            src={mostrarSenha ? eyeIcon : closedEye}
            alt="Input Senha"
            isPassword={true}
            hasError={!!errosCampos?.senha || !!erro}
            maxLength={100}
            onClickIcon={togglePasswordVisibility}
          />

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              errosCampos?.senha
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <span className="overflow-hidden text-red-500 text-sm px-2">
              {errosCampos?.senha}
            </span>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              erro
                ? "grid-rows-[1fr] opacity-100 mt-1"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <span className="overflow-hidden text-red-500 text-sm px-2 font-semibold">
              {erro}
            </span>
          </div>
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
          className="text-orange text-[14px] cursor-pointer text-center"
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
