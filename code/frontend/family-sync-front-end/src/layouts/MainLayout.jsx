import DefaultHeader from "../components/layout/DefaultHeader";
import SidebarNavigation from "../components/layout/SidebarNavigation";
import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <DefaultHeader />

      <div className="flex flex-1 w-full">
        <SidebarNavigation />

        <div className="w-screen h-full">
          <BackgroundImage
            src={imageBackground}
            alt={"Imagem Fundo"}
            blur_or_glass={"glass"}
          />
          <div className="flex items-center justify-center h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
