import BackgroundImage from "../components/BackgroundImage";
import { imageBackground } from "../assets";
import AccountRegister from "../components/AccountRegister";

function RegisterScreen() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <AccountRegister />
    </div>
  );
}

export default RegisterScreen;
