import DefaultCard from "../ui/DefaultCard";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import DefaultTextField from "../ui/DefaultTextField";
import { calendarIconForms } from "../../assets";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AccountRegister({
  nome,
  email,
  cpf,
  dataNascimento,
  senha,
  repetirSenha,
  setNome,
  setEmail,
  setCpf,
  setDataNascimento,
  setSenha,
  setRepetirSenha,
  handleSubmit,
  errosCampos,
  setErrosCampos,
  erro,
  preview,
  handleFileChange,
  removeImagem,
  typeSenha,
  srcSenha,
  iconClassSenha,
  onClickIconSenha,
  typeRepetirSenha,
  srcRepetirSenha,
  iconClassRepetirSenha,
  onClickIconRepetirSenha,
  onBlurField,
}) {
  const fileInputRef = useRef(null);
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

  const todayDate = new Date().toISOString().split("T")[0];
  const minDate = "1900-01-01";

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const prefetchLogin = () => {
    import("../../screens/LoginScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const camposInput = [
    {
      id: "nome",
      placeholder: "Nome",
      type: "text",
      alt: "Input Nome",
      setFunc: setNome,
      value: nome,
    },
    {
      id: "email",
      placeholder: "Email",
      type: "email",
      alt: "Input Email",
      setFunc: setEmail,
      value: email,
    },
    {
      id: "cpf",
      placeholder: "000.000.000-00",
      type: "text",
      alt: "Input CPF",
      setFunc: setCpf,
      value: cpf,
    },
    {
      id: "dataNascimento",
      placeholder: "Data Nascimento",
      type: "date",
      alt: "Input Data de Nascimento",
      setFunc: setDataNascimento,
      value: dataNascimento,
      max: todayDate,
      min: minDate,
      src: calendarIconForms,
    },
    {
      id: "senha",
      placeholder: "Senha",
      type: typeSenha,
      alt: "Input Senha",
      setFunc: setSenha,
      value: senha,
      src: srcSenha,
      isPassword: true,
      iconClass: iconClassSenha,
      onClickIcon: onClickIconSenha,
    },
    {
      id: "repetirSenha",
      placeholder: "Confirme a senha",
      type: typeRepetirSenha,
      alt: "Input Confirme a senha",
      setFunc: setRepetirSenha,
      value: repetirSenha,
      src: srcRepetirSenha,
      isPassword: true,
      iconClass: iconClassRepetirSenha,
      onClickIcon: onClickIconRepetirSenha,
    },
  ];

  const handleKeyDown = (e, currentIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const isLastField = currentIndex === camposInput.length - 1;

      if (isLastField) {
        handleSubmit();
      } else {
        const nextFieldId = camposInput[currentIndex + 1].id;
        document.getElementById(nextFieldId)?.focus();
      }
    }
  };

  return (
    <DefaultCard h={"pb-20"}>
      <div className="w-30 h-30 relative rounded-full border-2 border-orange flex items-center justify-center bg-white">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <IconPerfil
            is_white_backgroud={true}
            another_size={"h-70%"}
            onClickNew={preview ? removeImagem : handleButtonClick}
          />
        )}
        <div className="absolute -bottom-3 -right-3 flex items-center justify-center rounded-[50%] cursor-pointer">
          <input
            className="hidden"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <DefaultButton
            onClick={preview ? removeImagem : handleButtonClick}
            another_padding={"px-0 pb-1"}
            another_size={"h-12 w-12"}
            another_text_size={"text-3xl"}
            most_radius={true}
            text={preview ? "×" : "+"}
          />
        </div>
      </div>

      <h1 className="text-orange text-3xl -mt-6">Eu</h1>

      <div className="w-[90%] flex flex-col justify-center items-center gap-5">
        {camposInput.map((campo, index) => (
          <div key={campo.id} className="w-full flex flex-col gap-1">
            <DefaultTextField
              id={campo.id}
              placeholder={campo.placeholder}
              type={campo.type}
              alt={campo.alt}
              src={campo.src}
              value={campo.value}
              isPassword={campo.isPassword}
              iconClass={campo.iconClass}
              onClickIcon={campo.onClickIcon}
              hasError={!!errosCampos?.[campo.id]}
              maxLength={campo.id === "cpf" ? 14 : undefined}
              max={campo.max}
              min={campo.min}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onBlur={(e) =>
                onBlurField && onBlurField(campo.id, e.target.value)
              }
              onChange={(e) => {
                let valor = e.target.value;
                if (campo.id === "cpf") valor = formatCPF(valor);
                if (campo.id === "dataNascimento") {
                  if (campo.max && valor > campo.max) return;
                  if (campo.min && valor) {
                    const parts = valor.split("-");
                    const year = parts[0];
                    const minYear = campo.min.split("-")[0];
                    if (
                      year.length === 4 &&
                      year[0] !== "0" &&
                      year < minYear
                    ) {
                      valor = `${minYear}-${parts[1]}-${parts[2]}`;
                    }
                  }
                }
                campo.setFunc(valor);
                if (errosCampos?.[campo.id]) {
                  setErrosCampos((prev) => ({ ...prev, [campo.id]: "" }));
                }
              }}
            />
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${
                errosCampos?.[campo.id]
                  ? "max-h-5 opacity-100 mt-1"
                  : "max-h-0 opacity-0"
              }`}
            >
              <span className="text-red-500 text-sm px-2 block">
                {errosCampos[campo.id]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center flex-col h-14 pt-15 gap-3 w-[90%]">
        <div className="flex h-14 gap-15 items-center justify-center">
          <DefaultButton
            text="Cancelar"
            theme={false}
            border={true}
            onMouseEnter={prefetchLogin}
            onClick={() => navigate("/auth/login")}
          />
          <button type="submit" className="hidden" />
          <DefaultButton
            text="Cadastrar"
            theme={true}
            onMouseEnter={prefetchLogin}
            onClick={handleSubmit}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${
            erro ? "max-h-5 opacity-100 mt-1" : "max-h-0 opacity-0"
          }`}
        >
          <span className="text-red-500 text-sm px-2 block">{erro}</span>
        </div>
      </div>
    </DefaultCard>
  );
}

export default AccountRegister;
