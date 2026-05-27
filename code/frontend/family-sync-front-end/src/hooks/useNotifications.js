import { useState, useEffect, useRef, useCallback } from "react";
import { userService } from "../services/userService";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [newAlert, setNewAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastNotifIdRef = useRef(null);

  const clearAlert = useCallback(() => {
    setNewAlert(null);
  }, []);

  useEffect(() => {
    const token = Cookies.get("familysync_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const userData = jwtDecode(token);
    const userId = userData.id_usuario;

    const fetchNotifications = async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) setIsLoading(true);

        const response = await userService.getNotificationsByUser(userId);

        if (response.status_code === 200) {
          const fetchedNotifs = response.dados.notificacoes || [];

          const sortedNotifs = [...fetchedNotifs].sort(
            (a, b) => new Date(b.data) - new Date(a.data),
          );

          setNotifications(sortedNotifs);

          if (sortedNotifs.length > 0) {
            const currentLatest = sortedNotifs[0];
            const currentLatestId = String(currentLatest.id_notificacao);

            if (
              !isInitialLoad &&
              lastNotifIdRef.current !== null &&
              lastNotifIdRef.current !== currentLatestId
            ) {
              setNewAlert(currentLatest);
            }

            lastNotifIdRef.current = currentLatestId;
          }
        }
      } catch (err) {
        console.error("Erro no fetchNotifications:", err);
        if (isInitialLoad) setError(err.message);
      } finally {
        if (isInitialLoad) setIsLoading(false);
      }
    };

    fetchNotifications(true);

    const intervalId = setInterval(() => {
      fetchNotifications(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return { notifications, isLoading, error, newAlert, clearAlert };
}
