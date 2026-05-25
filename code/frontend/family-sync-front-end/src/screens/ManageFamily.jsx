import ManageFamilyView from "../components/features/ManageFamily/ManageFamilyView";
import { useManageFamily } from "../hooks/useManageFamily";

function ManageFamilyScreen() {
  const manageFamilyProps = useManageFamily();

  return <ManageFamilyView {...manageFamilyProps} />;
}

export default ManageFamilyScreen;
