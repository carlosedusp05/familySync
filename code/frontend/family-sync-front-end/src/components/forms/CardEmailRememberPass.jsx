import React, { useEffect } from "react";
import DefaultCard from "../ui/DefaultCard";
import DefaultTextField from "../ui/DefaultTextField";
import DefaultButton from "../ui/DefaultButton";
import { emailIcon } from "../../assets";
import { useNavigate } from "react-router-dom";

function CardEmailRememberPass({
  email,
  setEmail,
  handleSubmit,
  erro,
  errosCampos,
  setErrosCampos,
  onBlurField,
  loading,
}) {
  const navigate = useNavigate();

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

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <DefaultCard h={"h-fit"}>
      <h1 className="text-orange-dark font-bold text-2xl sm:text-3xl md:text-4xl">
        Recuperar Senha
      </h1>

      <div className="w-full sm:w-[90%] md:w-[88%] flex flex-col gap-4 md:gap-6 justify-center items-center">
        <p className="text-gray-500 text-sm text-center px-4">
          Insira o e-mail associado à sua conta para receber o código de
          verificação.
        </p>

        <div className="w-full flex flex-col gap-1">
          <DefaultTextField
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errosCampos?.email)
                setErrosCampos((prev) => ({ ...prev, email: "" }));
            }}
            onKeyDown={handleEmailKeyDown}
            onBlur={(e) => onBlurField && onBlurField("email", e.target.value)}
            type="text"
            src={emailIcon}
            alt="Input Email"
            hasError={!!errosCampos?.email || !!erro}
            maxLength={100}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${
              errosCampos?.email
                ? "max-h-5 opacity-100 mt-1"
                : "max-h-0 opacity-0"
            }`}
          >
            <span className="text-red-500 text-sm px-2 block">
              {errosCampos?.email || erro}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-[70%] max-sm:w-[50%] md:w-[50%] lg:w-[40%] flex-col gap-1 mt-4">
        <DefaultButton
          text={loading ? "Enviando..." : "Enviar Código"}
          theme={true}
          onClick={handleSubmit}
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

export default CardEmailRememberPass;
