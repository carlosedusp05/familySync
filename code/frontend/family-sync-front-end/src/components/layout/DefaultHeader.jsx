import IconFamilySync from "../icons/IconFamilySync";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import { useNavigate } from "react-router-dom";
import { notificationsIcon } from "../../assets/index";
import { useState } from "react";

function DefaultHeader({ disconnected }) {
  const navigate = useNavigate();

  const family_session = sessionStorage.getItem("@FamilySync:family:id");
  const hasFamily = Boolean(family_session && family_session.trim().length > 0);

  const handleNotificationClick = () => {
    if (hasFamily) {
      navigate("/dashboard/notifications");
    }
  };

  const prefetchLogin = () => {
    import("../../screens/LoginScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const prefetchRegister = () => {
    import("../../screens/RegisterScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const prefetchNotifications = () => {
    import("../../screens/NotificationsScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const prefetchLoggedIn = () => {
    import("../../screens/StartScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const children = disconnected ? (
    <div className="flex gap-15 ">
      <DefaultButton
        text="LOGIN"
        onMouseEnter={prefetchLogin}
        onClick={() => navigate("/auth/login")}
      />
      <DefaultButton
        text="CADASTRAR"
        onMouseEnter={prefetchRegister}
        onClick={() => navigate("/auth/register")}
      />
    </div>
  ) : (
    <div className="flex gap-12 max-md:gap-8 items-center justify-center">
      <IconPerfil
        is_white_backgroud={false}
        another_size={"max-md:h-7 max-md:w-7"}
      />
      <div
        className="bg-orange-dark flex items-center justify-center h-fit p-4 max-md:p-4 rounded-lg cursor-pointer duration-300 transition-all hover:scale-110"
        onMouseEnter={hasFamily ? prefetchNotifications : undefined}
        onClick={handleNotificationClick}
      >
        <img
          className="w-12 h-12 max-md:w-6 max-md:h-6"
          src={notificationsIcon}
          alt="Notificações"
          draggable={false}
        />
      </div>
    </div>
  );

  return (
    <header
      className={`w-full flex justify-between py-10 items-center bg-white px-16`}
    >
      {disconnected ? (
        <IconFamilySync />
      ) : (
        <IconFamilySync
          onMouseEnter={prefetchLoggedIn}
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer"
        />
      )}
      {children}
    </header>
  );
}

export default DefaultHeader;
