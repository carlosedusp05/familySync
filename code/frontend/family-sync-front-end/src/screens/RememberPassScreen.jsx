import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import CardRememberPass from "../components/forms/CardRememberPass";

function RememberPassScreen() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <BackgroundImage src={imageBackground} alt={"Imagem Fundo"} />
      <CardRememberPass />
    </div>
  );
}

export default RememberPassScreen;
