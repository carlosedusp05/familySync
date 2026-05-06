import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import AccountEdit from "../components/forms/AccountEdit";

function PerfilScreen() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <AccountEdit />
    </div>
  );
}

export default PerfilScreen;
