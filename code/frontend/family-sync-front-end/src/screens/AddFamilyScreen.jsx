import AddFamilyView from "../components/features/AddFamiliar/AddFamilyView.jsx";
import { useAddFamily } from "../hooks/useAddFamily.js";

function AddFamilyScreen() {
  const addFamilyProps = useAddFamily();

  return <AddFamilyView {...addFamilyProps} />;
}

export default AddFamilyScreen;
