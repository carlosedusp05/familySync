import React from "react";
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
  return (
    <MainLayout warning={warning} showWarning={showWarning}>
      {isLoading && <LoadingOverlay />}
      <div className="max-w-360 mx-auto w-full min-h-screen lg:h-full flex flex-col lg:flex-row gap-4 lg:gap-20 p-3 md:p-8 md:pb-8 overflow-y-auto lg:overflow-y-hidden ">
        <div className="w-full lg:w-[55%] flex flex-col gap-3 md:gap-6">
          <h2 className="text-2xl md:text-4xl text-terracota md:text-white font-bold text-center lg:text-left">
            Calendário
          </h2>
          <LargeCard
            color={"bg-white/95 shadow-xl rounded-[24px] md:rounded-[32px]"}
            p={"p-3 md:p-6"}
            size={"h-auto lg:h-[85%] xl:h-[75%] 2xl:h-[75%] w-full"}
          >
            <div className="w-full h-full">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
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

        <div className="w-full lg:w-[45%] flex flex-col gap-3 pb-20 md:gap-6 items-center lg:items-start">
          <h2 className="text-2xl md:text-4xl text-terracota md:text-white font-bold text-center lg:text-left w-full">
            Eventos Marcados
          </h2>

          <div
            className="flex flex-col items-center lg:items-start gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar [&::-webkit-scrollbar]:w-2.5
            [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[#282828]
            [&::-webkit-scrollbar-thumb]:rounded-md max-h-100px lg:max-h-[75vh] h-full w-full px-3 py-2 JSON-scroll"
          >
            {dateEvent.length > 0 ? (
              <MultEventsField events={dateEvent} onEdit={handleOpenModal} />
            ) : (
              <div className="text-lg text-terracota font-semibold px-6 py-4 rounded-xl bg-white shadow-md text-center w-full">
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
