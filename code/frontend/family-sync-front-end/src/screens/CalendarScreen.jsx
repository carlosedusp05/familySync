import LargeCard from "../components/ui/LargeCard";
import MainLayout from "../layouts/Mainlayout";
import MultEventsField from "../components/ui/MultEventsFIeld";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function FinancierScreen() {
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
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="100%"
              />
            </div>
          </LargeCard>
        </div>

        {/* Div Eventos */}
        <div className="w-[50%] h-full flex flex-col p-30 gap-10  items-center">
          <h2 className="text-5xl text-white font-bold">Eventos Marcados</h2>
          <div className="flex flex-col gap-5 overflow-y-auto max-h-full w-[90%] p-5">
            <MultEventsField
              events={[
                {
                  title: "Workshop de UI/UX",
                  hours: "14:00 ",
                  date: "2026-05-15",
                  desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                  creator: "Alice Silva",
                },
                {
                  title: "Daily Scrum",
                  hours: "09:00",
                  date: "2026-05-16",
                  desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                  creator: "Bruno Souza",
                },
                {
                  title: "Lançamento da Sprint",
                  hours: "10:00",
                  date: "2026-05-18",
                  desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                  creator: "Carla Mendes",
                },
                {
                  title: "Tech Talk: React 19",
                  hours: "19:00",
                  date: "2026-05-20",
                  desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                  creator: "Diego Ramos",
                },
                {
                  title: "Happy Hour Remoto",
                  hours: "18:00",
                  date: "2026-05-22",
                  desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
                  creator: "Elena Farias",
                },
                {
                  title: "Revisão de Código",
                  hours: "15:00",
                  date: "2026-05-23",
                  desc: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
                  creator: "Fabio Lima",
                },
                {
                  title: "Mentoria de Frontend",
                  hours: "11:00",
                  date: "2026-05-25",
                  desc: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
                  creator: "Giovanna Rossi",
                },
                {
                  title: "Ajustes de Deploy",
                  hours: "08:30",
                  date: "2026-05-26",
                  desc: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
                  creator: "Henrique Vaz",
                },
                {
                  title: "Planejamento Trimestral",
                  hours: "14:00",
                  date: "2026-06-01",
                  desc: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
                  creator: "Isabela Santos",
                },
                {
                  title: "Sessão de Pair Programming",
                  hours: "16:00",
                  date: "2026-06-03",
                  desc: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi.",
                  creator: "João Paulo",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default FinancierScreen;
