import { createRef, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { eventService } from "../services/eventService";
import { formatDate, formatHour } from "../utils/formatters";

export function useCalendar() {
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

  const [isLoading, setIsLoading] = useState(false);
  const [dateSelected, setDateSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [warning, setWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const [dateEvent, setDateEvent] = useState([]);

  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);

  const [eventCount, setEventCount] = useState([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInfo(null);
  };

  const familiaAtivaSalva = sessionStorage.getItem("@FamilySync:family:id");

  useEffect(() => {
    setIsLoading(true);

    async function loadEvents() {
      try {
        const response =
          await eventService.listEventsByFamily(familiaAtivaSalva);

        const formattedEvents = response.map((event) => ({
          ...event,
          data: formatDate(event.data),
          hora: formatHour(event.hora),
        }));

        setDateEvent(formattedEvents);
      } finally {
        setIsLoading(false);
      }
    }

    if (familiaAtivaSalva) {
      loadEvents();
    }
  }, [familiaAtivaSalva]);

  useEffect(() => {
    const grouped = dateEvent.reduce((acc, event) => {
      const date = event.data;

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    }, {});

    const formattedEvents = Object.entries(grouped).map(([date, count]) => ({
      title: `${count} evento(s)`,
      start: date,
    }));

    setEventCount(formattedEvents);
  }, [dateEvent]);

  const handleDelete = async (id) => {
    const response = await eventService.deleteEvent(id);

    if (response.StatusCode !== 200) {
      triggerAlert(
        "Não foi possível deletar o evento... Tente novamente mais tarde!",
      );
      return;
    }

    setDateEvent((prev) => prev.filter((item) => item.id_eventos !== id));
  };

  const handleSave = async (newData) => {
    setIsLoading(true);
    try {
      if (selectedInfo !== null) {
        const updateItem = {
          ...selectedInfo,
          titulo: newData.title,
          hora: newData.hours,
          descricao: newData.description,
        };

        const updateEvent = await eventService.updateEvent(
          selectedInfo.id_eventos,
          updateItem,
        );

        if (updateEvent.StatusCode !== 200) {
          triggerAlert(
            "Não foi possível atualizar o evento... Tente novamente mais tarde",
          );
          handleCloseModal();
          return;
        }

        setDateEvent((prev) =>
          prev.map((item) =>
            item.id_eventos === selectedInfo.id_eventos ? updateItem : item,
          ),
        );
      } else {
        const newItem = {
          titulo: newData.title,
          descricao: newData.description,
          data: newData.date,
          hora: newData.hours,
          id_familia: familiaAtivaSalva,
          id_usuario: user.id,
        };

        const createEvent = await eventService.createEvent(newItem);

        if (createEvent.StatusCode !== 201) {
          triggerAlert(
            "Não foi possível criar o evento... Tente novamente mais tarde",
          );
          handleCloseModal();
          return;
        }

        const newItemToState = {
          ...newItem,
          id_eventos: createEvent.Response.id_evento,
          usuario: user.nome,
        };

        setDateEvent((prev) => [newItemToState, ...prev]);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
    handleCloseModal();
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

    setTimeout(() => {
      setShowWarning(false);
    }, 2500);

    setTimeout(() => {
      setWarning("");
    }, 3000);
  }

  return {
    dateEvent,
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
    isLoading,
  };
}
