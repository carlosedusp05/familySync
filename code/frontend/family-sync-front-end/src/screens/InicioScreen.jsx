import DefaultButton from "../components/ui/DefaultButton";
import BackgroundImage from "../components/ui/BackgroundImage";
import DefaultHeader from "../components/layout/DefaultHeader";
import { useNavigate } from "react-router-dom";
import { imageBackground2 } from "../assets";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function InicioScreen() {
  const navigate = useNavigate();
  const { token: tokenConvite } = useParams();

  useEffect(() => {
    if (tokenConvite) {
      sessionStorage.setItem("family_invite_token", tokenConvite);
    }
  }, [tokenConvite]);

  const prefetchLogin = () => {
    import("./LoginScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };
  const token = Cookies.get("familysync_token");

  return (
    <div className="relative h-dvh w-full flex flex-col overflow-hidden">
      <BackgroundImage
        src={imageBackground2}
        alt={"Imagem Fundo"}
        blur_or_glass={"glass"}
      />

      <DefaultHeader disconnected={true} />

      <main className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 w-full justify-center lg:justify-between items-center gap-8 lg:gap-0">
        <p className="hidden lg:block text-white font-bold text-xl xl:text-2xl lg:w-[30%] xl:w-[22%] leading-relaxed">
          Brio é a quantidade de energia que se disponibiliza ao agir para fazer
          o melhor e sentir contentamento com a própria prática.
        </p>

        <div className="flex flex-col w-full max-w-md sm:max-w-lg lg:max-w-none lg:w-[40%] xl:w-[25%] gap-5 lg:gap-7 p-4 lg:p-5">
          <p className="text-white font-bold text-base sm:text-lg lg:text-[1.2rem] w-full lg:w-[95%] leading-relaxed text-left">
            O FamilySync é um ecossistema digital projetado para ser o "centro
            de comando" de uma residência. Ele utiliza tecnologia
            multiplataforma para resolver um dos maiores problemas das famílias
            modernas: a falha de comunicação e a descentralização de tarefas.
          </p>

          <div className="w-40 sm:w-60 lg:w-auto">
            <DefaultButton
              text="USAR WEBSITE"
              onMouseEnter={prefetchLogin}
              onClick={() =>
                token ? navigate("/dashboard") : navigate("/auth/login")
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default InicioScreen;
