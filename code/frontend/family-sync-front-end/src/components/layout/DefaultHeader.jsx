import IconFamilySync from "../icons/IconFamilySync";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { notificationsIcon } from "../../assets/index";
import { useNotifications } from "../../hooks/useNotifications";
import ShowAlert from "../ui/ShowAlert";

import { useUser } from "../../context/UserContext";

function DefaultHeader({ disconnected, warning, showWarning }) {
  const navigate = useNavigate();
  const location = useLocation();

  const family_session = sessionStorage.getItem("@FamilySync:family:id");
  const hasFamily = Boolean(family_session && family_session.trim().length > 0);

  const { notifications, newAlert, clearAlert } = useNotifications();
  const [showRedDot, setShowRedDot] = useState(false);
  const { userProfile } = useUser();

  const STORAGE_KEY = "@FamilySync:notifications:lastReadId";

  useEffect(() => {
    if (notifications.length > 0) {
      const latestId = String(notifications[0].id_notificacao);
      const storedLastReadId = localStorage.getItem(STORAGE_KEY);

      if (location.pathname === "/dashboard/notifications") {
        setShowRedDot(false);
        localStorage.setItem(STORAGE_KEY, latestId);
      } else {
        if (latestId !== storedLastReadId) {
          setShowRedDot(true);
        } else {
          setShowRedDot(false);
        }
      }
    } else {
      setShowRedDot(false);
    }
  }, [notifications, location.pathname]);

  useEffect(() => {
    if (newAlert) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [newAlert, clearAlert]);

  const handleNotificationClick = () => {
    if (hasFamily) {
      clearAlert();
      navigate("/dashboard/notifications");
    }
  };

  const prefetchLogin = () =>
    import("../../screens/LoginScreen").catch(console.log);
  const prefetchRegister = () =>
    import("../../screens/RegisterScreen").catch(console.log);
  const prefetchNotifications = () =>
    import("../../screens/NotificationsScreen").catch(console.log);
  const prefetchLoggedIn = () =>
    import("../../screens/StartScreen").catch(console.log);

  const children = disconnected ? (
    <div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-10">
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
    <div className="flex gap-4 md:gap-6 lg:gap-8 items-center justify-center">
      <IconPerfil
        is_white_backgroud={false}
        another_size={
          "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16  2xl:w-23 2xl:h-23"
        }
        fotoUrl={userProfile?.foto}
      />

      <div
        className="relative bg-orange-dark flex items-center justify-center h-fit p-2 lg:p-3 2xl:p-4 rounded-lg cursor-pointer duration-300 transition-all hover:scale-110"
        onMouseEnter={hasFamily ? prefetchNotifications : undefined}
        onClick={handleNotificationClick}
      >
        {showRedDot && (
          <span className="absolute -top-1 -right-2 flex h-4 w-4 md:h-5 md:w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 md:h-4 md:w-4 bg-red-500"></span>
          </span>
        )}

        <img
          className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8"
          src={notificationsIcon}
          alt="Notificações"
          draggable={false}
        />
      </div>
    </div>
  );

  return (
    <div className="relative w-full z-50">
      <header className="w-full flex justify-between py-4 px-4 sm:px-8 md:py-5 md:px-12 xl:py-6 2xl:py-9 lg:px-16 items-center bg-white relative z-50">
        <ShowAlert warning={warning} showWarning={showWarning} />
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

      {!disconnected && newAlert && (
        <div
          onClick={handleNotificationClick}
          className="absolute top-full left-0 z-40 w-full bg-yellow-light text-terracota py-4 px-4 sm:px-8 md:px-16 flex items-center justify-between font-bold cursor-pointer transition-all duration-500 hover:brightness-95 animate-fade-in-down border-t border-orange-dark/10 shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wider text-terracota/70 font-extrabold">
                Nova Notificação
              </span>
              <span className="text-base font-bold">{newAlert.titulo}</span>
              <p className="text-sm font-medium text-orange-dark line-clamp-1">
                {newAlert.descricao}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              clearAlert();
            }}
            className="text-terracota hover:bg-orange-dark/10 p-1 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default DefaultHeader;
