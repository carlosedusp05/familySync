import { useEffect, useMemo } from "react";
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

  useEffect(() => {
    const invites_family = sessionStorage.getItem("family_invite_token");
    if (invites_family) {
      sessionStorage.removeItem("family_invite_token");
    }
  }, []);

  const estaCarregando = !userData || isFamily === null;

  const userDataSincronizado = useMemo(() => {
    if (estaCarregando || !isFamily || isFamily.length === 0) {
      return userData;
    }

    let activeFamilyId = sessionStorage.getItem("@FamilySync:family:id");

    if (!activeFamilyId) {
      activeFamilyId = isFamily[0].id;
      sessionStorage.setItem("@FamilySync:family:id", activeFamilyId);
    }

    const familiaAtiva = isFamily.find(
      (f) => f.id === parseInt(activeFamilyId),
    );

    if (familiaAtiva) {
      return {
        ...userData,
        nomeFamilia: familiaAtiva.nome || familiaAtiva.nomeFamilia,
      };
    }

    return userData;
  }, [userData, isFamily, estaCarregando]);

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
