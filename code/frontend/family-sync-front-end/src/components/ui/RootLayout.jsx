import { Outlet, useNavigation } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";

function RootLayout() {
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <Outlet />
    </>
  );
}

export default RootLayout;
