import MainLayout from "../layouts/Mainlayout";
import InfoFamiliarContent from "../components/features/InfoFamiliar/InfoFamiliarContent";
import { useInfoFamiliar } from "../hooks/useInfoFamiliar";

function InfoFamiliarScreen() {
  const {
    members,
    activeMemberId,
    setActiveMemberId,
    infos,
    isModalOpen,
    selectedInfo,
    isModeEdition,
    handleCloseModal,
    handleOpenModal,
    handleDelete,
    handleSave,
  } = useInfoFamiliar();

  return (
    <MainLayout>
      <InfoFamiliarContent
        members={members}
        activeMemberId={activeMemberId}
        setActiveMemberId={setActiveMemberId}
        infos={infos}
        isModalOpen={isModalOpen}
        selectedInfo={selectedInfo}
        isModeEdition={isModeEdition}
        handleCloseModal={handleCloseModal}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDelete}
        handleSave={handleSave}
      />
    </MainLayout>
  );
}

export default InfoFamiliarScreen;
