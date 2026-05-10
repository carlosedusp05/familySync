import React, { useState, useEffect } from "react";
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
  onBlurField,
}) {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const togglePasswordVisibility = () => setMostrarSenha(!mostrarSenha);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Enter") {
        const activeElem = document.activeElement.tagName;
        if (activeElem !== "INPUT" && activeElem !== "TEXTAREA") {
          handleSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleSubmit]);

  const prefetchLoggedIn = () =>
    import("../../screens/StartScreen").catch(() => {});
  const prefetchRememberPass = () =>
    import("../../screens/RememberPassScreen").catch(() => {});
  const prefetchRegister = () =>
    import("../../screens/RegisterScreen").catch(() => {});

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("input-senha")?.focus();
    }
  };

  const handleSenhaKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <DefaultCard h={"h-fit"}>
      <IconFamilySync />
      <h2 className="text-orange-dark font-bold text-4xl">Login</h2>

      <div className="w-[88%] flex flex-col gap-6 justify-center items-center">
        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errosCampos?.email)
                setErrosCampos((prev) => ({ ...prev, email: "" }));
            }}
            onKeyDown={handleEmailKeyDown} // Mantém sua lógica de pular campo
            onBlur={(e) => onBlurField && onBlurField("email", e.target.value)}
            type="text"
            src={emailIcon}
            alt="Input Email"
            hasError={!!errosCampos?.email}
            maxLength={100}
          />
          {errosCampos?.email && (
            <div className="grid grid-rows-[1fr] opacity-100 transition-all duration-300">
              <span className="text-red-500 text-sm px-2">
                {errosCampos.email}
              </span>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            id="input-senha"
            placeholder="Senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              if (errosCampos?.senha)
                setErrosCampos((prev) => ({ ...prev, senha: "" }));
            }}
            onKeyDown={handleSenhaKeyDown}
            onBlur={(e) => onBlurField && onBlurField("senha", e.target.value)}
            type={mostrarSenha ? "text" : "password"}
            src={mostrarSenha ? eyeIcon : closedEye}
            alt="Input Senha"
            isPassword={true}
            hasError={!!errosCampos?.senha || !!erro}
            maxLength={100}
            onClickIcon={togglePasswordVisibility}
          />
          {errosCampos?.senha && (
            <div className="grid grid-rows-[1fr] opacity-100 transition-all duration-300">
              <span className="text-red-500 text-sm px-2">
                {errosCampos.senha}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-[40%] flex-col gap-1 mt-2">
        <DefaultButton
          text="Entrar"
          theme={true}
          type="submit"
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
          type="button"
          onMouseEnter={prefetchRegister}
          onClick={() => navigate("/auth/register")}
        />
      </div>
    </DefaultCard>
  );
}

export default CardLogin;
