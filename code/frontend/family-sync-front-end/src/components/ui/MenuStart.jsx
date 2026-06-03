import AOS from "aos";
import "aos/dist/aos.css";
import LargeCard from "../ui/LargeCard";
import {
  listIcon,
  calendarIcon,
  plusIcon,
  piggyBank,
  settingsIcon,
  infoIcon,
} from "../../assets";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, memo } from "react";

const prefetchRoutes = {
  list: () => import("../../screens/ListScreen").catch(console.error),
  calendar: () => import("../../screens/CalendarScreen").catch(console.error),
  newFamily: () => import("../../screens/AddFamilyScreen").catch(console.error),
  financier: () => import("../../screens/FinancierScreen").catch(console.error),
  manageFamily: () => import("../../screens/ManageFamily").catch(console.error),
  infoFamiliar: () =>
    import("../../screens/InfoFamiliarScreen").catch(console.error),
};

function MenuStart(props) {
  const hover = "transition-all duration-400 hover:scale-103 transition-ease";
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const upcomingEvents = useMemo(() => {
    if (!props.events || props.events.length === 0) return Array(4).fill(null);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const timestampHoje = hoje.getTime();

    const sortedEvents = props.events
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

    const paddedEvents = [...sortedEvents];
    while (paddedEvents.length < 4) {
      paddedEvents.push(null);
    }

    return paddedEvents;
  }, [props.events]);

  const recentInfos = useMemo(() => {
    if (!Array.isArray(props.infos) || props.infos.length === 0) return [];
    return [...props.infos].reverse().slice(0, 3);
  }, [props.infos]);

  return (
    <LargeCard
      key={props.userData.nome}
      color={"bg-yellow-light"}
      p={
        "py-6 pb-22 px-10 md:py-8 md:px-12 xl:pt-10 xl:pb-5 xl:px-20 2xl:pt-12 2xl:pb-10 2xl:px-28 bg-orange"
      }
      size={
        "h-[82%] w-[77%] md:h-[88%] md:w-[85%] xl:h-[82%] xl:w-[76%] 2xl:h-[80%] 2xl:w-[72%]"
      }
      data-aos="fade-up"
    >
      <div className="flex flex-col gap-2 md:gap-3 xl:gap-4 2xl:gap-5 h-full">
        {/* Header */}
        <div className="flex justify-between items-end gap-3 md:gap-4 xl:gap-6 2xl:gap-8">
          <div className="flex flex-col">
            <h2
              className="text-xl font-bold text-orange md:text-2xl xl:text-3xl 2xl:text-4xl"
              data-aos="fade-down"
              data-aos-delay="400"
            >
              <span className="ajuste-desfoque">
                Olá, {props.userData.nome}
              </span>
            </h2>

            <p
              className="text-base font-bold text-default md:text-lg xl:text-xl 2xl:text-2xl"
              data-aos="fade-down"
              data-aos-delay="450"
            >
              <span className="ajuste-desfoque">{props.userData.email}</span>
            </p>
          </div>

          <h2
            className="text-2xl font-bold text-orange md:text-3xl xl:text-3xl 2xl:text-4xl"
            data-aos="fade-down"
            data-aos-delay="450"
          >
            <span className="ajuste-desfoque">
              {props.userData.nomeFamilia}
            </span>
          </h2>
        </div>

        {/* Grid Div 1 */}
        <div className="grid grid-cols-10 gap-2 flex-[0.85] md:gap-3 xl:gap-4 xl:flex-[0.45] 2xl:gap-5 2xl:flex-[0.42]">
          {/* Lista Compartilhada */}
          <div
            className="col-span-4"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <div
              className={`w-full h-full flex items-center justify-center gap-2 md:gap-3 xl:gap-4 2xl:gap-5 bg-orange py-5 md:py-6 xl:py-8 2xl:py-10 rounded-2xl ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.list}
              onClick={() => navigate("/dashboard/lists")}
            >
              <img
                className="h-10 md:h-12 xl:h-16 2xl:h-20"
                src={listIcon}
                alt="Icon List"
              />
              <p className="font-bold text-xl md:text-2xl xl:text-3xl 2xl:text-4xl text-white flex-wrap">
                Lista <br /> Compartilhada
              </p>
            </div>
          </div>

          {/* Calendário */}
          <div className="col-span-4" data-aos="fade-down" data-aos-delay="500">
            <div
              className={`w-full h-full flex flex-col rounded-2xl pt-4 px-3 md:pt-5 md:px-5 xl:pt-6 xl:px-7 2xl:pt-8 2xl:px-9 bg-default gap-2 xl:gap-3 2xl:gap-4 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.calendar}
              onClick={() => navigate("/dashboard/calendar")}
            >
              <div className="flex w-full rounded-2xl overflow-hidden bg-white">
                {upcomingEvents.map((ev, i) => {
                  const tituloLimitado = ev
                    ? ev.titulo.length > 8
                      ? `${ev.titulo.substring(0, 8)}...`
                      : ev.titulo
                    : "Livre";

                  return (
                    <div key={i} className="flex flex-col w-full min-w-0">
                      <div className="bg-brown-dark text-white font-bold text-[12px] md:text-[14px] xl:text-[14px] 2xl:text-[15px] text-center py-1 md:py-1.5 2xl:py-2 whitespace-nowrap overflow-hidden text-ellipsis px-1">
                        {tituloLimitado}
                      </div>
                      <div
                        className={`flex justify-between p-1.5 md:p-2 xl:p-2.5 2xl:p-3 text-terracota text-[10px] md:text-[11px] xl:text-[8px] 2xl:text-[12px] font-medium ${
                          i !== 3 ? "border-r-2 border-brown-dark" : ""
                        }`}
                      >
                        <p>{ev ? ev.hora : "--:--"}</p>
                        <p>{ev ? ev.data.substring(0, 5) : "--/--"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-orange-dark text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
                <img
                  className="h-11 md:h-13 xl:h-18 2xl:h-22"
                  src={calendarIcon}
                  alt="Calendar Icon"
                />
                <h2>Calendário</h2>
              </div>
            </div>
          </div>

          {/* Adicionar Família */}
          <div className="col-span-2" data-aos="fade-left" data-aos-delay="600">
            <div
              className={`w-full h-full flex items-center justify-center p-4 md:p-5 xl:p-9 2xl:p-12 rounded-2xl bg-orange-dark ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.newFamily}
              onClick={() => navigate("/dashboard/family/add")}
            >
              <img className="w-[70%] h-[70%]" src={plusIcon} alt="Plus Icon" />
            </div>
          </div>
        </div>

        {/* Grid Div 2 */}
        <div className="grid grid-cols-11 gap-2 md:gap-3 flex-[1.1] xl:flex-[0.55] 2xl:gap-5 2xl:flex-[0.58]">
          {/* Gerenciamento Financeiro */}
          <div
            className="col-span-4"
            data-aos="fade-right"
            data-aos-delay="700"
          >
            <div
              className={`w-full h-full flex flex-col gap-3 md:gap-4 xl:gap-5 2xl:gap-6 items-center rounded-2xl bg-terracota p-3 md:p-4 xl:p-5 2xl:p-6 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.financier}
              onClick={() => navigate("/dashboard/finance")}
            >
              <div
                className="flex gap-[4%] bg-default w-full items-end rounded-2xl"
                style={{ height: "45%" }}
              >
                {[30, 40, 90, 85, 90, 60, 80, 75].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 bg-brown-dark ${i === 0 ? "rounded-bl-2xl" : ""} ${i === 7 ? "rounded-br-2xl" : ""}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="flex gap-2 md:gap-3 2xl:gap-4 items-center text-white font-semibold">
                <img
                  className="h-10 md:h-12 xl:h-18 2xl:h-22"
                  src={piggyBank}
                  alt="Piggy Icon"
                />
                <h2 className="text-2xl md:text-3xl xl:text-3xl 2xl:text-4xl leading-none">
                  Gerenciamento <br /> Financeiro
                </h2>
              </div>
            </div>
          </div>

          {/* Gerenciar Família */}
          <div className="col-span-4" data-aos="fade-up" data-aos-delay="800">
            <div
              className={`w-full h-full flex bg-yellow-cream rounded-2xl ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.manageFamily}
              onClick={() => navigate("/dashboard/family")}
            >
              <div className="h-full flex p-3 md:p-4 xl:p-5 2xl:p-7 rounded-l-2xl items-center justify-center bg-orange">
                <img
                  className="h-12 md:h-14 xl:h-20 2xl:h-26"
                  src={settingsIcon}
                  alt="Settings Icon"
                />
              </div>
              <div className="h-full flex items-center justify-center px-4 md:px-6 xl:px-8 2xl:px-10">
                <h2 className="text-orange text-[2rem] md:text-[2.3rem] xl:text-[2.2rem] 2xl:text-[3rem] leading-none font-bold">
                  Gerenciar <br /> Familia
                </h2>
              </div>
            </div>
          </div>

          {/* Informações Familiares */}
          {/* Informações Familiares */}
          <div className="col-span-3" data-aos="fade-left" data-aos-delay="900">
            <div
              className={`w-full h-full flex flex-col items-center justify-center bg-brown-dark rounded-2xl gap-1 md:gap-2 xl:gap-3 2xl:gap-4 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.infoFamiliar}
              onClick={() => navigate("/dashboard/family/info")}
            >
              <div className="flex items-center justify-start pl-5 md:pl-6 xl:pl-8 2xl:pl-10 w-full gap-2">
                <img
                  className="h-11 md:h-13 xl:h-15 2xl:h-20"
                  src={infoIcon}
                  alt="Info Icon"
                />
                <h2 className="text-white text-lg md:text-xl xl:text-xl 2xl:text-2xl font-bold">
                  Informações <br /> Familiar
                </h2>
              </div>

              <div className="w-[82%] h-[50%] bg-terracota rounded-2xl flex flex-col px-2 md:px-3 2xl:px-4 py-2 2xl:py-3">
                <h3 className="font-bold text-brown-dark text-[15px] md:text-[17px] xl:text-[18px] 2xl:text-[22px]">
                  Principais informações:
                </h3>
                <ul className="font-bold text-white text-[11px] md:text-[13px] xl:text-[14px] 2xl:text-[17px]">
                  {/* Utilizando o recentInfos no lugar do array cru */}
                  {recentInfos.length > 0 ? (
                    recentInfos.map((info, index) => (
                      <li key={index} className="truncate">
                        {info.descricao || info.titulo || info}
                      </li>
                    ))
                  ) : (
                    <li>Você ainda não tem informações cadastradas!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LargeCard>
  );
}

export default memo(MenuStart);
