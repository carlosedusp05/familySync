import DefaultHeader from "../components/layout/DefaultHeader";
import SidebarNavigation from "../components/layout/SidebarNavigation";
import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";

function MainLayout({ children, warning, showWarning }) {
  return (
    <div className="fixed inset-0 flex flex-col w-full h-[100dvh] overflow-hidden bg-black">
      <div className="shrink-0 z-50">
        <DefaultHeader warning={warning} showWarning={showWarning} />
      </div>

      <div className="flex flex-1 min-h-0 w-full overflow-hidden relative">
        <SidebarNavigation />

        <main className="flex-1 min-h-0 h-full w-full relative overflow-hidden max-md:pb-24">
          <BackgroundImage
            src={imageBackground}
            alt={"Imagem Fundo"}
            blur_or_glass={"glass"}
          />
          <div className="relative h-full w-full z-10 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
