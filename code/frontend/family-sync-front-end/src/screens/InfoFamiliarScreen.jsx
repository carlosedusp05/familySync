import MainLayout from "../layouts/MainLayout";
import InfoFamiliarContent from "../components/features/InfoFamiliar/InfoFamiliarContent";
import { useInfoFamiliar } from "../hooks/useInfoFamiliar";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function InfoFamiliarScreen() {
  const infoFamiliarProps = useInfoFamiliar();

  return (
    <MainLayout>
      <InfoFamiliarContent {...infoFamiliarProps} />
    </MainLayout>
  );
}

export default InfoFamiliarScreen;
