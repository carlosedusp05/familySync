import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import MultEventsField from "../components/ui/MultEventsFIeld";
import ModalEvents from "../components/ui/ModalEvent";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import ShowAlert from "../components/ui/ShowAlert";

function CalendarScreen() {
  const user = JSON.parse(localStorage.getItem("@FamilySync:user"));

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInfo(null);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`dateEvents`);
    setDateEvent(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(`dateEvents`, JSON.stringify(dateEvent));
  }, [dateEvent]);

  const handleDelete = (id) => {
    setDateEvent((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (newData) => {
    if (selectedInfo !== null) {
      setDateEvent((prev) =>
        prev.map((item) =>
          item.id === selectedInfo.id
            ? {
                ...item,
                date: newData.date,
                hours: newData.hours,
                title: newData.title,
                desc: newData.description,
              }
            : item,
        ),
      );
    } else {
      const newItem = {
        id: Date.now(),
        date: newData.date,
        hours: newData.hours,
        title: newData.title,
        desc: newData.description,
        creator: user.nome,
      };
      setDateEvent((prev) => [newItem, ...prev]);
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

  return (
    <MainLayout>
      <div className="h-full flex w-full">
        {/* Div Calendário */}
        <div className="w-[50%] h-full flex flex-col p-30 gap-7">
          <h2 className="text-5xl text-white font-bold">Calendário</h2>
          <LargeCard
            color={"bg-yellow-light border border-terracota"}
            p={"px-20 py-5"}
            size={"h-[90%] w-[95%]"}
          >
            <div className="w-full h-full p-6">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="100%"
                dateClick={handleDateClick}
              />

              <ShowAlert warning={warning} showWarning={showWarning} />

              <ModalEvents
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                selectedDate={dateSelected}
                onSave={handleSave}
                onDelete={handleDelete}
                isInitialEdit={isModeEdition}
                data={selectedInfo}
              />
            </div>
          </LargeCard>
        </div>

        {/* Div Eventos */}
        <div className="w-[50%] h-full flex flex-col p-30 gap-10  items-center">
          <h2 className="text-5xl text-white font-bold">Eventos Marcados</h2>
          <div className="flex flex-col items-center gap-5 overflow-y-auto max-h-full w-[75%] px-2 ">
            <MultEventsField events={dateEvent} onEdit={handleOpenModal} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CalendarScreen;
