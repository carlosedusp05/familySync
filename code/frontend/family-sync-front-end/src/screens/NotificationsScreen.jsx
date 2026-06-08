import MainLayout from "../layouts/MainLayout";
import MultNotificationField from "../components/ui/MultNotificationField";
import { useNotifications } from "../hooks/useNotifications";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function NotificationsScreen() {
  const { notifications, isLoading, error } = useNotifications();

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="w-full h-full pt-8 md:pt-16 overflow-hidden text-base flex flex-col">
        <div
          className="w-[90%] md:w-[80%] max-w-4xl flex-1 min-h-0 mx-auto pb-24 md:pb-12
        overflow-y-auto overflow-x-hidden overscroll-none flex flex-col justify-start items-center gap-4 px-2
        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md"
        >
          {error && (
            <p className="text-red-500 font-bold text-xl md:text-3xl">
              Erro: {error}
            </p>
          )}

          {!isLoading && !error && notifications.length === 0 && (
            <p className="text-white text-lg md:text-xl text-center">
              Você não tem novas notificações.
            </p>
          )}

          {!isLoading && !error && notifications.length > 0 && (
            <div className="w-full min-w-0 flex flex-col gap-4">
              <MultNotificationField notifications={notifications} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default NotificationsScreen;
