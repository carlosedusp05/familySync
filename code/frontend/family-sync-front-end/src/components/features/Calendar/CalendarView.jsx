import React from "react";
import MainLayout from "../../../layouts/MainLayout.jsx";
import LargeCard from "../../ui/LargeCard.jsx";
import MultEventsField from "./MultEventsFIeld.jsx";
import ModalEvents from "./ModalEvent.jsx";
import ShowAlert from "./ShowAlert.jsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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
}) {
  return (
    <MainLayout>
      <div className="h-full flex w-full">
        <div className="w-[50%] h-full flex flex-col p-30 gap-7">
          <h2 className="text-5xl text-white font-bold">Calendário</h2>
          <LargeCard
            color={"bg-white border border-terracota"}
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
          <div className="flex flex-col items-center gap-5 overflow-y-auto max-h-full w-[85%] px-2 ">
            {dateEvent.length > 0 ? (
              <MultEventsField events={dateEvent} onEdit={handleOpenModal} />
            ) : (
              <div className="text-2xl text-terracota font-semibold px-10 py-4 rounded-2xl bg-white">
                Sua familia não tem eventos cadastrados!
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CalendarView;
