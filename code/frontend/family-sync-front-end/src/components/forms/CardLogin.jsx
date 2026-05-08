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
  errosCampos,
  setErrosCampos,
}) {
  const navigate = useNavigate();

  // Estado para controlar a alternância
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
    <DefaultCard h={"h-[50%]"}>
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
          {errosCampos?.email && (
            <span className="text-red-500 text-sm px-2">
              {errosCampos.email}
            </span>
          )}
        </div>

        {/* Campo de Senha - Alternando Ícone e Cor */}
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
            // ALTERNÂNCIA DE ÍCONE:
            src={mostrarSenha ? eyeIcon : closedEye}
            alt="Input Senha"
            isPassword={true}
            hasError={!!errosCampos?.senha}
            maxLength={20}
            // AÇÃO DE CLIQUE:
            onClickIcon={togglePasswordVisibility}
            // COR LARANJA (Apenas quando aberto):
            iconClass={
              mostrarSenha
                ? "invert-[52%] sepia-[91%] saturate-[3258%] hue-rotate-[1deg] brightness-[103%] contrast-[104%]"
                : ""
            }
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
