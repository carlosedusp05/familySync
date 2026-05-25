import MainLayout from "../../../layouts/MainLayout";
import MembersList from "./MembersList";
import FamilyDetails from "./FamilyDetails";
import PermissionsModal from "./PermissionsModal";
import DeleteMemberModal from "./DeleteMemberModal";

function ManageFamilyView(props) {
  const {
    isPermissionsOpen,
    isDeleteOpen,
    selectedMember,
    closePermissionsModal,
    closeDeleteModal,
    confirmDeleteMember,
    handleAddMember,
    formData,
  } = props;

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-10 h-full relative">
        <div className="w-[95%] max-w-350 h-full flex gap-8">
          <MembersList {...props} />
          <FamilyDetails {...props} />
        </div>

        <PermissionsModal
          isOpen={isPermissionsOpen}
          onClose={closePermissionsModal}
          member={selectedMember}
        />

        <DeleteMemberModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteMember}
          member={selectedMember}
        />
      </div>
    </MainLayout>
  );
}

export default ManageFamilyView;
