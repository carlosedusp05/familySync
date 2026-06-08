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
    <div className="fixed inset-0 z-99999 bg-zinc-950/20 backdrop-blur-sm flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-2">
        <div className="w-70 h-70 max-lg:h-50 max-lg:w-50 max-sm:h-40 max-sm:w-40 flex items-center justify-center">
          {View}
        </div>
      </div>
    </div>
  );
}

export default LoadingOverlay;
