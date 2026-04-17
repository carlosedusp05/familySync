import BackgroundImage from "../components/BackgroundImage";
import { imageBackground } from "../assets";
import CardLogin from "../components/CardLogin";

function LoginScreen() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <BackgroundImage src={imageBackground} alt={"Imagem Fundo"} />
      <CardLogin />
    </div>
  );
}

export default LoginScreen;
