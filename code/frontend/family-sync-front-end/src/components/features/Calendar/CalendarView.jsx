import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import MainLayout from "../../../layouts/MainLayout.jsx";
import LargeCard from "../../ui/LargeCard.jsx";
import MultEventsField from "./MultEventsFIeld.jsx";
import ModalEvents from "./ModalEvent.jsx";
import FullCalendar from "@fullcalendar/react";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import LoadingOverlay from "../../ui/LoadingOverlay.jsx";

function CalendarView({
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
}) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MainLayout warning={warning} showWarning={showWarning}>
      {isLoading && <LoadingOverlay />}
      <div className="xl:px-55 xl:pt-5 w-full h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-y-hidden">
        <div className="w-full lg:w-1/2 h-full flex flex-col px-4 md:px-8 lg:px-12 py-4 lg:py-8 gap-4 lg:gap-7">
          <h2 className="text-2xl md:text-4xl lg:text-4xl text-terracota md:text-white font-bold text-center lg:text-left">
            Calendário
          </h2>

          <LargeCard
            color={"bg-white/95 shadow-xl rounded-[24px] md:rounded-[32px]"}
            p={"p-3 md:p-4 lg:px-8 lg:py-4"}
            size={"w-full lg:w-[95%] h-auto lg:h-[90%]"}
          >
            <div className="w-full h-full p-2 md:p-3 lg:p-4 overflow-y-hidden">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height={isDesktop ? "100%" : "auto"}
                aspectRatio={1.2}
                dateClick={handleDateClick}
                events={eventCount}
                locale={ptBrLocale}
              />

              <ModalEvents
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                selectedDate={dateSelected}
                onSave={handleSave}
                onDelete={handleDelete}
                isInitialEdit={isModeEdition}
                data={selectedInfo}
                isLoading={isLoading}
              />
            </div>
          </LargeCard>
        </div>

        <div className="w-full lg:w-1/2 h-full flex flex-col px-4 md:px-8 lg:px-8 py-4 lg:py-8 gap-4 lg:gap-10 items-center">
          <h2 className="text-2xl md:text-4xl lg:text-4xl text-terracota md:text-white font-bold text-center w-full">
            Eventos Marcados
          </h2>

          <div className="flex flex-col items-center gap-4 lg:gap-5 overflow-y-auto overflow-x-hidden custom-scrollbar [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md h-full w-full lg:w-[85%] px-2 pb-20 lg:pb-0 JSON-scroll">
            {dateEvent.length > 0 ? (
              <MultEventsField events={dateEvent} onEdit={handleOpenModal} />
            ) : (
              <div className="text-lg lg:text-2xl text-terracota font-semibold px-6 lg:px-10 py-4 rounded-xl lg:rounded-2xl bg-white shadow-md text-center">
                Sua família não tem eventos cadastrados!
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CalendarView;
