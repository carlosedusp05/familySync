import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import CardEmailRememberPass from "../components/forms/CardEmailRememberPass";
import CardRememberPass from "../components/forms/CardRememberPass";
import { useRememberPass } from "../hooks/useRememberPass";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function RememberPassScreen() {
  const rememberProps = useRememberPass();

  return (
    <div className="h-dvh w-screen flex justify-center items-center">
      {rememberProps.isLoading && <LoadingOverlay />}
      <BackgroundImage src={imageBackground} alt={"Imagem Fundo"} />

      {rememberProps.step === 1 ? (
        <CardEmailRememberPass
          email={rememberProps.email}
          setEmail={rememberProps.setEmail}
          handleSubmit={rememberProps.handleSendEmail}
          erro={rememberProps.erro}
          errosCampos={rememberProps.errosCampos}
          setErrosCampos={rememberProps.setErrosCampos}
          onBlurField={rememberProps.validateFieldOnBlur}
          loading={rememberProps.loading}
        />
      ) : (
        <CardRememberPass
          code={rememberProps.code}
          setCode={rememberProps.setCode}
          password={rememberProps.password}
          setPassword={rememberProps.setPassword}
          confirmPassword={rememberProps.confirmPassword}
          setConfirmPassword={rememberProps.setConfirmPassword}
          handleSubmit={rememberProps.handleResetPassword}
          erro={rememberProps.erro}
          errosCampos={rememberProps.errosCampos}
          setErrosCampos={rememberProps.setErrosCampos}
          onBlurField={rememberProps.validateFieldOnBlur}
          loading={rememberProps.loading}
        />
      )}
    </div>
  );
}

export default RememberPassScreen;
