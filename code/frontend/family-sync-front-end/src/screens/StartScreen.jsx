import { imageBackground } from "../assets";
import DefaultHeader from "../components/layout/DefaultHeader";
import BackgroundImage from "../components/ui/BackgroundImage";
import MenuStart from "../components/ui/MenuStart";
import { useUserData } from "../hooks/useUserData";
import AddFamilyForm from "../components/features/AddFamiliar/AddFamilyForm";
import { useAddFamily } from "../hooks/useAddFamily";

function StartScreen(props) {
  const { userData, infos, isFamily } = useUserData();
  const addFamilyProps = useAddFamily();

  const invites_family = sessionStorage.getItem("family_invite_token");

  if (invites_family) {
    sessionStorage.removeItem("family_invite_token");
  }

  const estaCarregando = !userData || isFamily === null;

  let userDataSincronizado = userData;

  if (!estaCarregando && isFamily && isFamily.length > 0) {
    const activeFamilyId = sessionStorage.getItem("@FamilySync:family:id");

    if (!activeFamilyId) {
      sessionStorage.setItem("@FamilySync:family:id", isFamily[0].id);
    }

    const familiaAtiva = isFamily.find(
      (f) => f.id === parseInt(activeFamilyId || isFamily[0].id),
    );

    if (familiaAtiva) {
      userDataSincronizado = {
        ...userData,
        nomeFamilia: familiaAtiva.nome || familiaAtiva.nomeFamilia,
      };
    }
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
        {estaCarregando ? null : isFamily && isFamily.length > 0 ? (
          <MenuStart
            props={props}
            userData={userDataSincronizado}
            infos={infos}
          />
        ) : (
          <AddFamilyForm {...addFamilyProps} />
        )}
      </div>
    </div>
  );
}

export default StartScreen;
