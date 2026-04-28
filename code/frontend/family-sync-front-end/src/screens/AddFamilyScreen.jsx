import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";

function AddFamilyScreen() {
  return (
    <MainLayout>
      <LargeCard>
        <div className="w-62.5 h-62.5 relative rounded-full border-orange felx, items-center justify-center">
          <img className="h-[50%] w-[50%]" src="" alt="" />
          <input
            className="absolute opacity-0 w-full h-full cursor-pointer"
            type="file"
          />
        </div>
      </LargeCard>
    </MainLayout>
  );
}

export default AddFamilyScreen;
