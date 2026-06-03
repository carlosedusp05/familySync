import React, { useState, useEffect } from "react";
import DefaultCard from "../ui/DefaultCard";
import DefaultTextField from "../ui/DefaultTextField";
import DefaultButton from "../ui/DefaultButton";
import { eyeIcon, closedEye } from "../../assets";
import { useNavigate } from "react-router-dom";

function CardRememberPass({
  code,
  setCode,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  erro,
  errosCampos,
  setErrosCampos,
  onBlurField,
  loading,
}) {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Enter") {
        const activeElem = document.activeElement.tagName;
        if (activeElem !== "INPUT" && activeElem !== "TEXTAREA") {
          handleFinalSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [code, password, confirmPassword]);

  const handleFinalSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      navigate("/auth/login");
    }
  };

  const handleCodeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("input-nova-senha")?.focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("input-confirmar-senha")?.focus();
    }
  };

  const handleConfirmKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFinalSubmit();
    }
  };

  return (
    <DefaultCard h={"h-fit"}>
      <h2 className="text-orange-dark font-bold text-2xl sm:text-3xl md:text-4xl">
        Nova Senha
      </h2>

      <div className="w-full sm:w-[90%] md:w-[88%] flex flex-col gap-4 md:gap-5 justify-center items-center">
        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            placeholder="Código do e-mail"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (errosCampos?.code)
                setErrosCampos((prev) => ({ ...prev, code: "" }));
            }}
            onKeyDown={handleCodeKeyDown}
            onBlur={(e) => onBlurField && onBlurField("code", e.target.value)}
            type="text"
            hasError={!!errosCampos?.code}
            maxLength={6}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${errosCampos?.code ? "max-h-5 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
          >
            <span className="text-red-500 text-sm px-2 block">
              {errosCampos?.code}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            id="input-nova-senha"
            placeholder="Nova Senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errosCampos?.password)
                setErrosCampos((prev) => ({ ...prev, password: "" }));
            }}
            onKeyDown={handlePasswordKeyDown}
            onBlur={(e) =>
              onBlurField && onBlurField("password", e.target.value)
            }
            type={mostrarSenha ? "text" : "password"}
            src={mostrarSenha ? eyeIcon : closedEye}
            alt="Input Senha"
            isPassword={true}
            hasError={!!errosCampos?.password || !!erro}
            maxLength={100}
            onClickIcon={() => setMostrarSenha(!mostrarSenha)}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${errosCampos?.password ? "max-h-5 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
          >
            <span className="text-red-500 text-sm px-2 block">
              {errosCampos?.password || erro}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            id="input-confirmar-senha"
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errosCampos?.confirmPassword)
                setErrosCampos((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            onKeyDown={handleConfirmKeyDown}
            onBlur={(e) =>
              onBlurField && onBlurField("confirmPassword", e.target.value)
            }
            type={mostrarConfirmar ? "text" : "password"}
            src={mostrarConfirmar ? eyeIcon : closedEye}
            alt="Input Confirme a senha"
            isPassword={true}
            hasError={!!errosCampos?.confirmPassword}
            maxLength={100}
            onClickIcon={() => setMostrarConfirmar(!mostrarConfirmar)}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${errosCampos?.confirmPassword ? "max-h-5 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
          >
            <span className="text-red-500 text-sm px-2 block">
              {errosCampos?.confirmPassword}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-[70%] max-sm:w-[50%] md:w-[50%] lg:w-[40%] flex-col gap-1 mt-4">
        <DefaultButton
          text={loading ? "Alterando..." : "Trocar Senha"}
          theme={true}
          onClick={handleFinalSubmit}
          disabled={loading}
        />
        <DefaultButton
          text="Cancelar"
          theme={false}
          border={true}
          onClick={() => navigate("/auth/login")}
        />
      </div>
    </DefaultCard>
  );
}

export default CardRememberPass;
