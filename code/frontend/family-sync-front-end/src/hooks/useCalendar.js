import { useState, useMemo } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { eventService } from "../services/eventService";
import { formatDate, formatHour } from "../utils/formatters";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCalendar({ telaInicial = false } = {}) {
  const queryClient = useQueryClient();
  const token = Cookies.get("familysync_token");

  const user = token
    ? (() => {
        const decoded = jwtDecode(token);
        return {
          nome: decoded.nome,
          id: decoded.id_usuario,
          idFamily: decoded.is_familia,
        };
      })()
    : {};

  const [dateSelected, setDateSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warning, setWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);

  const familiaAtivaSalva = sessionStorage.getItem("@FamilySync:family:id");

  const isMobile = window.innerWidth <= 768;
  const deveCarregar = !(telaInicial && isMobile);

  const { data: dateEvent = [], isLoading } = useQuery({
    queryKey: ["events", familiaAtivaSalva],
    queryFn: async () => {
      const response = await eventService.listEventsByFamily(familiaAtivaSalva);
      return response.map((event) => ({
        ...event,
        data: formatDate(event.data),
        hora: formatHour(event.hora),
      }));
    },
    enabled: !!familiaAtivaSalva && deveCarregar,
    staleTime: 1000 * 60 * 5,
  });

  const proximosEventos = useMemo(() => {
    if (!deveCarregar || !dateEvent || dateEvent.length === 0) {
      return [];
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const timestampHoje = hoje.getTime();

    return dateEvent
      .map((ev) => {
        let dateObj;
        if (ev.data && ev.data.includes("/")) {
          const [dia, mes, ano] = ev.data.split("/");
          dateObj = new Date(ano, mes - 1, dia);
        } else {
          dateObj = new Date(ev.data);
        }
        return { ...ev, timestamp: dateObj.getTime(), dateObj };
      })
      .filter((ev) => ev.timestamp >= timestampHoje)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 4);
  }, [dateEvent, deveCarregar]);

  const eventCount = useMemo(() => {
    const grouped = dateEvent.reduce((acc, event) => {
      const date = event.data;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      title: `${count} evento(s)`,
      start: date,
    }));
  }, [dateEvent]);

  const deleteMutation = useMutation({
    mutationFn: (id) => eventService.deleteEvent(id),
    onSuccess: (response) => {
      if (response.StatusCode !== 200) {
        triggerAlert(
          "Não foi possível deletar o evento... Tente novamente mais tarde!",
        );
      } else {
        queryClient.invalidateQueries(["events", familiaAtivaSalva]);
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (newItem) => eventService.createEvent(newItem),
    onSuccess: (response) => {
      if (response.StatusCode !== 201) {
        triggerAlert(
          "Não foi possível criar o evento... Tente novamente mais tarde",
        );
      } else {
        queryClient.invalidateQueries(["events", familiaAtivaSalva]);
        handleCloseModal();
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updateItem }) =>
      eventService.updateEvent(id, updateItem),
    onSuccess: (response) => {
      if (response.StatusCode !== 200) {
        triggerAlert(
          "Não foi possível atualizar o evento... Tente novamente mais tarde",
        );
      } else {
        queryClient.invalidateQueries(["events", familiaAtivaSalva]);
        handleCloseModal();
      }
    },
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInfo(null);
  };

  const handleOpenModal = (info = null, forceEdit = true) => {
    setSelectedInfo(info);
    setIsModeEdition(forceEdit);
    setIsModalOpen(true);
  };

  function handleDateClick(info) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [ano, mes, dia] = info.dateStr.split("-");
    const dataClicada = new Date(ano, mes - 1, dia);

    if (dataClicada < hoje) {
      triggerAlert("Não é possível marcar eventos em datas passadas!");
      return;
    }
    setDateSelected(info.dateStr);
    setIsModalOpen(true);
  }

  function triggerAlert(message) {
    setWarning(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 2500);
    setTimeout(() => setWarning(""), 3000);
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleSave = (newData) => {
    if (selectedInfo !== null) {
      const updateItem = {
        ...selectedInfo,
        titulo: newData.title,
        hora: newData.hours,
        descricao: newData.description,
      };
      updateMutation.mutate({ id: selectedInfo.id_eventos, updateItem });
    } else {
      const newItem = {
        titulo: newData.title,
        descricao: newData.description,
        data: newData.date,
        hora: newData.hours,
        id_familia: familiaAtivaSalva,
        id_usuario: user.id,
      };
      createMutation.mutate(newItem);
    }
  };

  const isGlobalLoading =
    (isLoading && deveCarregar) ||
    deleteMutation.isPending ||
    createMutation.isPending ||
    updateMutation.isPending;

  return {
    dateEvent,
    proximosEventos,
    warning,
    showWarning,
    isModalOpen,
    dateSelected,
    selectedInfo,
    isModeEdition,
    handleDateClick,
    handleCloseModal,
    handleSave,
    handleDelete,
    handleOpenModal,
    eventCount,
    isLoading: isGlobalLoading,
  };
}
