import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import AccountRegister from "../components/forms/AccountRegister";

function RegisterScreen() {
  //inputs

  return (
    <div className="h-screen w-full flex justify-center items-center">
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
