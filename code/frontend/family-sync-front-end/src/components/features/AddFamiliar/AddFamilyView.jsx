import MainLayout from "../../../layouts/MainLayout.jsx";
import LoadingOverlay from "../../ui/LoadingOverlay.jsx";
import AddFamilyForm from "./AddFamilyForm.jsx";

function AddFamilyView(props) {
  return (
    <MainLayout>
      <div className="w-full h-full flex justify-center items-center relative overflow-hidden p-2 sm:p-6">
        <AddFamilyForm {...props} />
        {props.isLoading && <LoadingOverlay />}
      </div>
    </MainLayout>
  );
}

export default AddFamilyView;
