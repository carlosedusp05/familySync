import MainLayout from "../../../layouts/MainLayout.jsx";
import DefaultButton from "../../ui/DefaultButton";
import InputAddFamily from "./InputAddFamily.jsx";
import SelectAddFamily from "./SelectAddFamily.jsx";
import LoadingOverlay from "../../ui/LoadingOverlay.jsx";
import InputEmailMembers from "./InputEmailMembers.jsx";
import AddFamilyForm from "./AddFamilyForm.jsx";

function AddFamilyView(props) {
  return (
    <MainLayout>
      <div className="w-full h-full flex justify-center items-center relative">
        <AddFamilyForm {...props} />
        {props.isLoading && <LoadingOverlay />}
      </div>
    </MainLayout>
  );
}

export default AddFamilyView;
