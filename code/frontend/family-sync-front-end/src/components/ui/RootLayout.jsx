import { Suspense, useState, useEffect } from "react";
import { Outlet, useNavigation, useLocation } from "react-router-dom"; // Importe useLocation
import LoadingOverlay from "./LoadingOverlay";
import { familySyncTextIcon, familySyncSmallIcon } from "../../assets";

function RootLayout() {
  const navigation = useNavigation();
  const location = useLocation();
  const isLoading = navigation.state === "loading";

  const isDashboard = location.pathname.startsWith("/dashboard");

  const [showSplash, setShowSplash] = useState(false);
  const [splashOpacity, setSplashOpacity] = useState("opacity-0");
  const [revealText, setRevealText] = useState(false);

  useEffect(() => {
    const iniciarAnimacao = () => {
      if (!isDashboard || sessionStorage.getItem("@FamilySync:splashRodou"))
        return;

      setShowSplash(true);
      setSplashOpacity("opacity-0");
      setRevealText(false);

      sessionStorage.setItem("@FamilySync:splashRodou", "true");

      setTimeout(() => setSplashOpacity("opacity-100"), 50);

      const tempoInicioRevelacao = 300;
      setTimeout(() => setRevealText(true), tempoInicioRevelacao);

      const tempoTotalParaSumir = tempoInicioRevelacao + 1000 + 1000;

      setTimeout(() => {
        setSplashOpacity("opacity-0");
        setTimeout(() => setShowSplash(false), 500);
      }, tempoTotalParaSumir);
    };

    const isAuthenticated = localStorage.getItem("@FamilySync:isAuthenticated");
    const splashRodou = sessionStorage.getItem("@FamilySync:splashRodou");

    if (isAuthenticated === "true" && !splashRodou && isDashboard) {
      iniciarAnimacao();
    }

    window.addEventListener("startSplash", iniciarAnimacao);

    return () => {
      window.removeEventListener("startSplash", iniciarAnimacao);
    };
  }, [isDashboard]);

  return (
    <>
      {showSplash && isDashboard && (
        <div
          className={`fixed inset-0 z-9999 flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${splashOpacity}`}
        >
          <div className="flex items-center">
            <div
              className={`overflow-hidden transition-[max-width] duration-3000 ease-in-out flex justify-start ${revealText ? "max-w-300 opacity-100" : "max-w-0 opacity-0"}`}
            >
              <img
                src={familySyncTextIcon}
                alt="FamilySync Text"
                className="h-70 w-auto max-w-none object-left"
              />
            </div>
            <img
              src={familySyncSmallIcon}
              alt="FamilySync Icon"
              className="h-70 w-auto z-10 drop-shadow-sm"
            />
          </div>
        </div>
      )}

      <div className={showSplash && isDashboard ? "hidden" : "block"}>
        {isLoading && !showSplash && <LoadingOverlay />}

        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <LoadingOverlay />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}

export default RootLayout;
