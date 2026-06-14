import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export function useNotifications() {
  const [newAlert, setNewAlert] = useState(null);
  const lastNotifIdRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const userId = useMemo(() => {
    const token = Cookies.get("familysync_token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id_usuario;
    } catch {
      return null;
    }
  }, []);

  const {
    data: fetchedNotifs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const response = await userService.getNotificationsByUser(userId);
      if (response && response.status_code === 200) {
        return response.dados.notificacoes || [];
      }
      return [];
    },
    enabled: !!userId,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  const notifications = useMemo(() => {
    return [...fetchedNotifs].sort(
      (a, b) => new Date(b.data) - new Date(a.data),
    );
  }, [fetchedNotifs]);

  useEffect(() => {
    if (notifications.length > 0) {
      const currentLatest = notifications[0];
      const currentLatestId = String(currentLatest.id_notificacao);

      if (isInitialLoadRef.current) {
        lastNotifIdRef.current = currentLatestId;
        isInitialLoadRef.current = false;
        return;
      }

      if (
        lastNotifIdRef.current !== null &&
        lastNotifIdRef.current !== currentLatestId
      ) {
        setTimeout(() => {
          setNewAlert(currentLatest);
        }, 0);
      }

      lastNotifIdRef.current = currentLatestId;
    }
  }, [notifications]);

  const clearAlert = () => setNewAlert(null);

  return {
    notifications,
    isLoading,
    error,
    newAlert,
    clearAlert,
  };
}
