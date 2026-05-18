import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { eventService } from "../services/eventService";
import { create } from "axios";

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

  const [dateSelected, setDateSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [warning, setWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const [dateEvent, setDateEvent] = useState(() => {
    const saved = localStorage.getItem(`dateEvents`);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);

  const [eventCount, setEventCount] = useState([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInfo(null);
  };

  // useEffect(() => {
  //   localStorage.setItem(`dateEvents`, JSON.stringify(dateEvent));
  // }, [dateEvent]);

  useEffect(() => {
    async function loadEvents() {
      if (!user.idFamily) return;
      const response = await eventService.listEventsByFamily(user.idFamily);
      setDateEvent(response);
    }

    loadEvents();
  }, [user.idFamily]);

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
    setDateEvent((prev) => prev.filter((item) => item.id !== id));
    const response = await eventService.deleteEvent(id);

    if (response.statusCode !== 200) {
      triggerAlert(
        "Não foi possível deletar o evento... Tente novamente mais tarde!",
      );
    }
  };

  const handleSave = async (newData) => {
    if (selectedInfo !== null) {
      const updateItem = {
        ...selectedInfo,
        titulo: newData.title,
        hora: newData.hours,
        descricao: newData.description,
      };

      const updateEvent = await eventService.updateEvent(updateItem);

      console.log(updateEvent);

      if (updateEvent.statusCode !== 200) {
        triggerAlert(
          "Não foi possível atualizar o evento... Tente novamente mais tarde",
        );
        handleCloseModal();
        return;
      }

      setDateEvent((prev) =>
        prev.map((item) => (item.id === selectedInfo.id ? updateItem : item)),
      );
    } else {
      const newItem = {
        id: Date.now(),
        titulo: newData.title,
        descricao: newData.description,
        data: newData.date,
        hora: newData.hours,
        id_familia: user.idFamily,
        id_usuario: user.id,
      };

      const createEvent = await eventService.createEvent(newItem);

      // if (createEvent.statusCode !== 201) {
      //   triggerAlert(
      //     "Não foi possível criar o evento... Tente novamente mais tarde",
      //   );
      //   handleCloseModal();
      //   return;
      // }

      const newItemToState = {
        ...newItem,
        creator: user.nome,
      };

      setDateEvent((prev) => [newItemToState, ...prev]);
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
  };
}
