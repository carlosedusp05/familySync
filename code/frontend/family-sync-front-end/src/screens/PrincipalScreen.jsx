import { imageBackground, listIcon } from "../assets";
import DefaultHeader from "../components/layout/DefaultHeader";
import BackgroundImage from "../components/ui/BackgroundImage";
import LargeCard from "../components/ui/LargeCard";

function PrincipalScreen(props) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <DefaultHeader />
      <div className="w-full flex justify-center items-center h-full ">
        <LargeCard
          color={"bg-yellow-light"}
          p={"p-40 pt-25"}
          size={"h-[85%] w-[80%]"}
        >
          {/* div total */}
          <div className="flex flex-col gap-10">
            {/* div texts */}
            <div className="flex justify-between items-center gap-5">
              {/* div text esquerda */}
              <div className="flex flex-col">
                <h2 className="text-4xl font-bold text-orange">
                  Olá, {"props.nome"}
                </h2>
                <p className="text-2xl font-bold text-default">
                  {"props.email"}
                </p>
              </div>
              <h2 className="text-4xl font-bold text-orange">
                Nome da Familia
              </h2>
            </div>

            {/* Grid Div */}
            <div className="grid grid-cols-12">
              <div className="col-span-4 flex items-center justify-center gap-4 bg-orange py-10 rounded-2xl">
                <img src={listIcon} alt="" />
                <p className="font-bold text-5xl text-white ">
                  Lista
                  <br />
                  Compartilhada
                </p>
              </div>
              <div className=""></div>
              <div className=""></div>
              <div className=""></div>
              <div className=""></div>
            </div>
          </div>
        </LargeCard>
      </div>
    </div>
  );
}

export default PrincipalScreen;
