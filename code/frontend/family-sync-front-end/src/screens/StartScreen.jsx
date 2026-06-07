import { useEffect, useMemo } from "react";
import { imageBackground } from "../assets";
import DefaultHeader from "../components/layout/DefaultHeader";
import BackgroundImage from "../components/ui/BackgroundImage";
import MenuStart from "../components/ui/MenuStart";
import AddFamilyForm from "../components/features/AddFamiliar/AddFamilyForm";
import { useAddFamily } from "../hooks/useAddFamily";
import { useCalendar } from "../hooks/useCalendar";
import { useUser } from "../context/UserContext";

function StartScreen(props) {
  const { userProfile, families, infos, isLoadingUser } = useUser();
  const addFamilyProps = useAddFamily();

  const { dateEvent } = useCalendar();

  useEffect(() => {
    const invites_family = sessionStorage.getItem("family_invite_token");
    if (invites_family) {
      sessionStorage.removeItem("family_invite_token");
    }
  }, []);

  const estaCarregando = isLoadingUser;

  useEffect(() => {
    if (families && families.length > 0) {
      const activeFamilyId = sessionStorage.getItem("@FamilySync:family:id");
      if (!activeFamilyId) {
        sessionStorage.setItem("@FamilySync:family:id", families[0].id);
      }
    }
  }, [families]);

  const userDataSincronizado = useMemo(() => {
    if (estaCarregando || !Array.isArray(families) || families.length === 0) {
      return userProfile;
    }

    const activeId =
      sessionStorage.getItem("@FamilySync:family:id") || families[0].id;
    const familiaAtiva = families.find((f) => f.id === parseInt(activeId));

    if (familiaAtiva && userProfile) {
      return {
        ...userProfile,
        nomeFamilia: familiaAtiva.nome || familiaAtiva.nomeFamilia,
      };
    }

    return userProfile;
  }, [userProfile, families, estaCarregando]);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <DefaultHeader />
      <div className="w-full flex justify-center items-center h-full">
        <div className="w-full flex justify-center items-center h-full">
          {estaCarregando ? null : families && families.length > 0 ? (
            <MenuStart
              props={props}
              userData={userDataSincronizado}
              infos={infos}
              events={dateEvent}
            />
          ) : (
            <AddFamilyForm {...addFamilyProps} />
          )}
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
