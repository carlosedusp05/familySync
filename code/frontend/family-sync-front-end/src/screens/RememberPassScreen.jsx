import BackgroundImage from "../components/BackgroundImage";
import { imageBackground } from "../assets";
import CardRememberPass from "../components/CardRememberPass";

function RememberPassScreen() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <BackgroundImage src={imageBackground} alt={"Imagem Fundo"} />
      <CardRememberPass />
    </div>
  );
}

export default RememberPassScreen;
