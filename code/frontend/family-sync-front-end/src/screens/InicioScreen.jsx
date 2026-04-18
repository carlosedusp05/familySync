import IconFamilySync from "../components/IconFamilySync";
import DefaultButton from "../components/DefaultButton";
import BackgroundImage from "../components/BackgroundImage";
import { imageBackground2 } from "../assets";

function InicioScreen() {
  return (
    <div className="h-screen w-full">
      <BackgroundImage src={imageBackground2} alt={"Imagem Fundo"} />
      <header className="w-full h-15 flex justify-between items-center bg-white p-16">
        <IconFamilySync is_small={true} />
        <div className="flex gap-2 ">
          <DefaultButton />
        </div>
      </header>
    </div>
  );
}

export default InicioScreen;
