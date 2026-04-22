import DefaultHeader from "../components/layout/DefaultHeader";
import SidebarNavigation from "../components/layout/SidebarNavigation";
import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <DefaultHeader />

      <div className="flex flex-1 w-full overflow-hidden">
        <SidebarNavigation />

        <main className="flex-1 h-full overflow-y-auto relative">
          <BackgroundImage
            src={imageBackground}
            alt={"Imagem Fundo"}
            blur_or_glass={"glass"}
          />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
