import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground, eyeIcon, closedEye } from "../assets";
import AccountRegister from "../components/forms/AccountRegister";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useRegister } from "../hooks/useRegister";

function RegisterScreen() {
  const {
    nome,
    setNome,
    email,
    setEmail,
    cpf,
    setCpf,
    dataNascimento,
    setDataNascimento,
    senha,
    setSenha,
    repetirSenha,
    setRepetirSenha,
    mostrarSenha,
    togglePasswordVisibility,
    mostrarRepetirSenha,
    toggleRepeatPasswordVisibility,
    erro,
    errosCampos,
    setErrosCampos,
    preview,
    handleFileChange,
    removeImagem,
    isLoading,
    validateFieldOnBlur,
    handleSubmit,
  } = useRegister();

  return (
    <div className="h-screen w-full flex justify-center items-center">
      {isLoading && <LoadingOverlay />}
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <AccountRegister
        nome={nome}
        email={email}
        cpf={cpf}
        dataNascimento={dataNascimento}
        senha={senha}
        repetirSenha={repetirSenha}
        setNome={setNome}
        setEmail={setEmail}
        setCpf={setCpf}
        setDataNascimento={setDataNascimento}
        setSenha={setSenha}
        setRepetirSenha={setRepetirSenha}
        handleSubmit={handleSubmit}
        erro={erro}
        errosCampos={errosCampos}
        setErrosCampos={setErrosCampos}
        preview={preview}
        handleFileChange={handleFileChange}
        removeImagem={removeImagem}
        typeSenha={mostrarSenha ? "text" : "password"}
        srcSenha={mostrarSenha ? eyeIcon : closedEye}
        onClickIconSenha={togglePasswordVisibility}
        typeRepetirSenha={mostrarRepetirSenha ? "text" : "password"}
        srcRepetirSenha={mostrarRepetirSenha ? eyeIcon : closedEye}
        onClickIconRepetirSenha={toggleRepeatPasswordVisibility}
        onBlurField={validateFieldOnBlur}
      />
    </div>
  );
}

export default RegisterScreen;
