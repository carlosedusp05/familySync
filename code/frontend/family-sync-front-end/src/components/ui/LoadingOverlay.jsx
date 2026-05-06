import { useLottie } from "lottie-react";
import { loadingOrange } from "../../assets";

function LoadingOverlay() {
  const options = {
    animationData: loadingOrange,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="fixed inset-0 z-9999 bg-zinc-950/20 backdrop-blur-sm flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-2">
        <div className="w-70 h-70 flex items-center justify-center">{View}</div>
      </div>
    </div>
  );
}

export default LoadingOverlay;
