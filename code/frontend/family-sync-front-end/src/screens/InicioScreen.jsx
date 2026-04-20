import IconFamilySync from "../components/IconFamilySync";
import DefaultButton from "../components/DefaultButton";
import BackgroundImage from "../components/BackgroundImage";
import { imageBackground2 } from "../assets";

function InicioScreen() {
  return (
    <div className="h-screen w-full">
      <BackgroundImage
        src={imageBackground2}
        alt={"Imagem Fundo"}
        blur_or_glass={"glass"}
      />
      <header className="w-full h-[10%] flex justify-between items-center bg-white py-12 px-25">
        <IconFamilySync is_small={true} />
        <div className="flex gap-15 ">
          <DefaultButton text="LOGIN" />
          <DefaultButton text="CADASTRAR" />
        </div>
      </header>
      <main className="flex  px-40 w-full justify-between h-[90%] items-center">
        <p className="text-white font-bold text-2xl w-[20%]">
          Brio é a quantidade de energia que se disponibiliza ao agir para fazer
          o melhor e sentir contentamento com a própria prática.
        </p>
        <div className="flex flex-col w-[20%] gap-7 P-5 ">
          <p className="text-white font-bold text-[1.2rem] w-[95%]">
            O FamilySync é um ecossistema digital projetado para ser o "centro
            de comando" de uma residência. Ele utiliza tecnologia
            multiplataforma para resolver um dos maiores problemas das famílias
            modernas: a falha de comunicação e a descentralização de tarefas.
          </p>
          <DefaultButton text="USAR WEBSITE" />
        </div>
      </main>
    </div>
  );
}

export default InicioScreen;
