import { imageBackground } from "../assets";
import DefaultHeader from "../components/layout/DefaultHeader";
import BackgroundImage from "../components/ui/BackgroundImage";
import DefaultCard from "../components/ui/DefaultCard";

function PrincipalScreen() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <DefaultHeader />
      <DefaultCard />
    </div>
  );
}

export default PrincipalScreen;
