import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import AccountEdit from "../components/forms/AccountEdit";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { usePerfil } from "../hooks/usePerfil";

function PerfilScreen() {
  const perfilProps = usePerfil();

  return (
    <div className="fixed inset-0 w-full flex justify-center items-center overflow-hidden">
      {perfilProps.isLoading && <LoadingOverlay />}
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <AccountEdit {...perfilProps} />
    </div>
  );
}

export default PerfilScreen;
