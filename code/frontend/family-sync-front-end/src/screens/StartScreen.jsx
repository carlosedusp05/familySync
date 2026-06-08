import { useEffect, useMemo } from "react";
import { imageBackground } from "../assets";
import DefaultHeader from "../components/layout/DefaultHeader";
import BackgroundImage from "../components/ui/BackgroundImage";
import MenuStart from "../components/ui/MenuStart";
import AddFamilyForm from "../components/features/AddFamiliar/AddFamilyForm";
import { useAddFamily } from "../hooks/useAddFamily";
import { useCalendar } from "../hooks/useCalendar";
import { useUser } from "../context/UserContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function StartScreen(props) {
  const { userProfile, families, infos, isLoadingUser, isLoadingInfos } =
    useUser();
  const addFamilyProps = useAddFamily();

  const { proximosEventos, isLoading: isLoadingEvents } = useCalendar({
    telaInicial: true,
  });

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
    if (isLoadingUser || !userProfile) return null;

    const activeFamilyId = sessionStorage.getItem("@FamilySync:family:id");

    const activeFamily = families.find(
      (f) =>
        String(f.id) === activeFamilyId ||
        String(f.id_familia) === activeFamilyId,
    );

    return {
      nome: userProfile.nome || "Usuário",
      email: userProfile.email || "",
      nomeFamilia: activeFamily ? activeFamily.nome : "Sua Família",
      hasFamily: families.length > 0,
      activeFamilyId: activeFamilyId,
    };
  }, [userProfile, families, isLoadingUser]);

  return (
    <div className="fixed inset-0 flex flex-col w-full h-dvh overflow-hidden overscroll-none">
      {estaCarregando && <LoadingOverlay />}
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <DefaultHeader />

      <div className="w-full flex-1 flex justify-center items-center overflow-hidden p-2">
        <div className="w-full h-full flex justify-center items-center">
          {!estaCarregando &&
            (families && families.length > 0 ? (
              <MenuStart
                props={props}
                userData={userDataSincronizado}
                infos={infos}
                events={proximosEventos}
                isLoadingInfos={isLoadingInfos}
                isLoadingEvents={isLoadingEvents}
              />
            ) : (
              <AddFamilyForm {...addFamilyProps} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
