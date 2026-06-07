import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export function useNotifications() {
  const [newAlert, setNewAlert] = useState(null);
  const lastNotifIdRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // 1. Pegamos o userId de forma segura fora do loop de renderização
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

  // 2. O React Query assume todo o controle do Polling e gerenciamento de estados
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
    enabled: !!userId, // Só executa se o usuário estiver logado
    refetchInterval: 10000, // Tempo do Polling inteligente (Ex: 10 segundos para ser mais leve, ou mude para 5000)
    refetchOnWindowFocus: true, // Garante busca imediata ao voltar para a aba do app
  });

  // 3. Ordenamos as notificações vindas do cache de forma síncrona e performática
  const notifications = useMemo(() => {
    return [...fetchedNotifs].sort(
      (a, b) => new Date(b.data) - new Date(a.data),
    );
  }, [fetchedNotifs]);

  // 4. Monitoramos a chegada de novos alertas sempre que a lista mudar
  // 4. Monitoramos a chegada de novos alertas sempre que a lista mudar
  useEffect(() => {
    if (notifications.length > 0) {
      const currentLatest = notifications[0];
      const currentLatestId = String(currentLatest.id_notificacao);

      // Se for a primeira carga absoluta de dados, apenas registra o ID atual e sai
      if (isInitialLoadRef.current) {
        lastNotifIdRef.current = currentLatestId;
        isInitialLoadRef.current = false;
        return;
      }

      // MÁGICA DO ALERTA: Só dispara se o ID novo for diferente do anterior
      if (
        lastNotifIdRef.current !== null &&
        lastNotifIdRef.current !== currentLatestId
      ) {
        // Envelopamos em um setTimeout para tirar a execução do fluxo síncrono do React
        setTimeout(() => {
          setNewAlert(currentLatest);
        }, 0);
      }

      // Atualiza a referência com o último ID descoberto
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
