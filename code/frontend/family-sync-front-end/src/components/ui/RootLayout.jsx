import { Suspense, useState, useEffect } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";
import { familySyncAnimation } from "../../assets";

function RootLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const [showSplash, setShowSplash] = useState(false);
  const [splashOpacity, setSplashOpacity] = useState("opacity-0");

  useEffect(() => {
    const iniciarAnimacao = () => {
      setShowSplash(true);
      setSplashOpacity("opacity-0");

      setTimeout(() => {
        setSplashOpacity("opacity-100");
      }, 50);

      setTimeout(() => {
        setSplashOpacity("opacity-0");

        setTimeout(() => {
          setShowSplash(false);
        }, 500);
      }, 2800);
    };

    window.addEventListener("startSplash", iniciarAnimacao);

    return () => {
      window.removeEventListener("startSplash", iniciarAnimacao);
    };
  }, []);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-9999 flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${splashOpacity}`}
        >
          <video
            src={familySyncAnimation}
            className="w-200 h-auto"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      )}

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
    </>
  );
}

export default RootLayout;
