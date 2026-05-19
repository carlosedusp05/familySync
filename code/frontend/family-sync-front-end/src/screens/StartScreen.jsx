import { imageBackground } from "../assets";
import DefaultHeader from "../components/layout/DefaultHeader";
import BackgroundImage from "../components/ui/BackgroundImage";
import MenuStart from "../components/ui/MenuStart";
import { useUserData } from "../hooks/useUserData";

function StartScreen(props) {
  const { userData, infos } = useUserData();

  const invites_family = localStorage.getItem("family_invite_token");

  if (invites_family) {
    // lugar para requisição do convite
    localStorage.removeItem("family_invite_token");
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <DefaultHeader />
      <div className="w-full flex justify-center items-center h-full ">
        <MenuStart props={props} userData={userData} infos={infos} />
      </div>
    </div>
  );
}

export default StartScreen;
