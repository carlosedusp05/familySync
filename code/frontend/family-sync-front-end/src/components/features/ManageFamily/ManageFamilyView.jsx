import MainLayout from "../../../layouts/MainLayout";
import MembersList from "./MembersList";
import FamilyDetails from "./FamilyDetails";
import PermissionsModal from "./PermissionsModal";
import LoadingOverlay from "../../ui/LoadingOverlay";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function ManageFamilyView(props) {
  const {
    isPermissionsOpen,
    isDeleteOpen,
    isLeaveOpen,
    selectedMember,
    closePermissionsModal,
    closeDeleteModal,
    closeLeaveModal,
    confirmDeleteMember,
    confirmLeaveFamily,
    isLoading,
    isDeleteFamilyOpen,
    closeDeleteFamilyModal,
    confirmDeleteFamily,
    familyData,
  } = props;

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="flex flex-col items-center justify-start py-4 h-full relative overflow-y-auto lg:overflow-hidden custom-scrollbar">
        <div className="w-[95%] max-w-350 h-auto lg:h-full flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 lg:pb-0">
          <MembersList {...props} />
          <FamilyDetails {...props} />
        </div>

        <PermissionsModal
          isOpen={isPermissionsOpen}
          onClose={closePermissionsModal}
          member={selectedMember}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteMember}
          title="Remover Membro?"
          confirmText="Sim, Remover"
          description={
            <>
              Tem certeza que deseja remover{" "}
              <strong>{selectedMember?.name}</strong> da família? Esta ação não
              pode ser desfeita.
            </>
          }
        />

        <ConfirmDeleteModal
          isOpen={isDeleteFamilyOpen}
          onClose={closeDeleteFamilyModal}
          onConfirm={confirmDeleteFamily}
          title="Excluir Família?"
          confirmText="Sim, Excluir"
          description={
            <>
              Tem certeza que deseja excluir a família{" "}
              <strong>{familyData?.nome}</strong>? Todos os dados serão
              perdidos.
            </>
          }
        />

        <ConfirmDeleteModal
          isOpen={isLeaveOpen}
          onClose={closeLeaveModal}
          onConfirm={confirmLeaveFamily}
          title="Sair da Família?"
          confirmText="Sim, Sair"
          description={
            <>
              Tem certeza que deseja sair da família{" "}
              <strong>{familyData?.nome}</strong>? Você perderá o acesso.
            </>
          }
        />
      </div>
    </MainLayout>
  );
}

export default ManageFamilyView;
