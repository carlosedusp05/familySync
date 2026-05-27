import MainLayout from "../layouts/MainLayout";
import MultNotificationField from "../components/ui/MultNotificationField";
import { useNotifications } from "../hooks/useNotifications";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function NotificationsScreen() {
  const { notifications, isLoading, error } = useNotifications();

  return (
    <MainLayout>
      {isLoading && <LoadingOverlay />}
      <div className="w-full h-full pt-16">
        <div
          className="w-[70%] h-full overflow-y-auto flex flex-col justify-start items-center gap-4 mx-auto px-2 pb-10
            [&::-webkit-scrollbar]:w-2.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#282828]
            [&::-webkit-scrollbar-thumb]:rounded-md"
        >
          {error && (
            <p className="text-red-500 font-bold text-3xl">Erro: {error}</p>
          )}

          {!isLoading && !error && notifications.length === 0 && (
            <p className="text-white text-xl">
              Você não tem novas notificações.
            </p>
          )}

          {!isLoading && !error && notifications.length > 0 && (
            <MultNotificationField notifications={notifications} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default NotificationsScreen;
