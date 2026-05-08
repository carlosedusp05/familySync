import { Suspense } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";

function RootLayout() {
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  return (
    <>
      {isLoading && <LoadingOverlay />}

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
