import DefaultCard from "../ui/DefaultCard";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import DefaultTextField from "../ui/DefaultTextField";
import ErrorForms from "../ui/ErrorForms";
import { eyeIcon, closedEye } from "../../assets";
import { useRef } from "react";
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
  erro,
  errosCampos,
  setErrosCampos,
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
}) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  return (
    <DefaultCard h={"pb-30"}>
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
            className="absolute opacity-0 w-full h-full cursor-pointer hidden"
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
        {camposInput.map((campo) => (
          <div key={campo.id} className="w-full flex flex-col gap-1">
            <DefaultTextField
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
              onChange={(e) => {
                let valor = e.target.value;
                if (campo.id === "cpf") {
                  valor = formatCPF(valor);
                }
                campo.setFunc(valor);
                if (errosCampos?.[campo.id]) {
                  setErrosCampos((prev) => ({ ...prev, [campo.id]: "" }));
                }
              }}
            />
            {errosCampos?.[campo.id] && (
              <span className="text-red-500 text-sm px-2">
                {errosCampos[campo.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center flex-col h-14 pt-15 gap-3 w-[90%]">
        <ErrorForms erro={erro} />
        <div className="flex h-14 gap-15 items-center justify-center">
          <DefaultButton
            text="Cancelar"
            theme={false}
            border={true}
            onMouseEnter={prefetchLogin}
            onClick={() => navigate("/auth/login")}
          />
          <DefaultButton
            text="Cadastrar"
            theme={true}
            onMouseEnter={prefetchLogin}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </DefaultCard>
  );
}

export default AccountRegister;
