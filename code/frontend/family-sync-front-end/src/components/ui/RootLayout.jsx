import { Suspense, useState, useEffect } from "react";
import { Outlet, useNavigation, useLocation } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";
import { familySyncTextIcon, familySyncSmallIcon } from "../../assets";
import { splashSound } from "../../assets";

function RootLayout() {
  const navigation = useNavigation();
  const location = useLocation();
  const isLoading = navigation.state === "loading";

  const isAuthRoute =
    location.pathname.includes("/auth") || location.pathname === "/";

  const [showSplash, setShowSplash] = useState(() => {
    const jaRodou = sessionStorage.getItem("@FamilySync:splashRodou");
    return !isAuthRoute && !jaRodou;
  });

  const [splashOpacity, setSplashOpacity] = useState(
    showSplash ? "opacity-100" : "opacity-0",
  );
  const [revealText, setRevealText] = useState(false);

  useEffect(() => {
    if (!showSplash) return;

    sessionStorage.setItem("@FamilySync:splashRodou", "true");

    const splashAudio = new Audio(splashSound);
    splashAudio.volume = 0.5;

    let timers = [];

    timers.push(
      setTimeout(() => {
        setRevealText(true);
        splashAudio.play().catch((error) => {
          console.warn(
            "Áudio bloqueado pela política de autoplay do navegador:",
            error,
          );
        });
      }, 50),
    );

    const tempoTotalParaSumir = 3200;

    timers.push(
      setTimeout(() => {
        setSplashOpacity("opacity-0");
        timers.push(
          setTimeout(() => {
            setShowSplash(false);
          }, 1000),
        );
      }, tempoTotalParaSumir),
    );

    return () => {
      timers.forEach(clearTimeout);
      splashAudio.pause();
    };
  }, [showSplash]);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${splashOpacity}`}
        >
          <div className="flex items-center">
            <div
              className={`overflow-hidden transition-[max-width] duration-2800 ease-in-out flex justify-start ${
                revealText ? "max-w-[850px] opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              <img
                src={familySyncTextIcon}
                alt="FamilySync Text"
                className="h-70 w-auto max-w-none object-left max-lg:h-50 max-sm:h-22"
              />
            </div>
            <img
              src={familySyncSmallIcon}
              alt="FamilySync Icon"
              className="h-70 w-auto z-10 max-lg:h-50 max-sm:h-22"
            />
          </div>
        </div>
      )}

      <div className="block min-h-screen relative">
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
