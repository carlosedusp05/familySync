import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";
import { familyIcon, plusIcon } from "../assets/index";
import DefaultButton from "../components/ui/DefaultButton";

function AddFamilyScreen() {
  return (
    <MainLayout>
      <div className="w-full h-full flex justify-center items-center">
        <LargeCard
          color={"bg-yellow-light"}
          p={"px-50"}
          size={"h-[80%] w-[75%]"}
        >
          <div className="h-full w-full flex items-center justify-between">
            <div className="w-90 h-90 relative rounded-full border border-orange flex items-center justify-center bg-white">
              <img className="h-[50%]" src={familyIcon} alt="Family Icon" />
              <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-[50%] cursor-pointer">
                <input
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  type="file"
                />
                <DefaultButton
                  another_padding={"px-0 pb-2"}
                  another_size={"h-20 w-20"}
                  another_text_size={"text-7xl"}
                  most_radius={true}
                  text="+"
                />
              </div>
            </div>
            <div className=""></div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default AddFamilyScreen;
