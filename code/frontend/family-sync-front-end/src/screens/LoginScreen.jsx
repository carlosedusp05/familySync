import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import CardLogin from "../components/forms/CardLogin";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useLogin } from "../hooks/useLogin";

function LoginScreen() {
  const {
    email,
    setEmail,
    senha,
    setSenha,
    erro,
    errosCampos,
    setErrosCampos,
    isLoading,
    validateFieldOnBlur,
    handleSubmit,
  } = useLogin();

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {isLoading && <LoadingOverlay />}

      <BackgroundImage
        src={imageBackground}
        alt="Imagem Fundo"
        blur_or_glass="blur"
      />

      <CardLogin
        email={email}
        senha={senha}
        setEmail={setEmail}
        setSenha={setSenha}
        handleSubmit={handleSubmit}
        erro={erro}
        errosCampos={errosCampos}
        setErrosCampos={setErrosCampos}
        onBlurField={validateFieldOnBlur}
      />
    </div>
  );
}

export default LoginScreen;
