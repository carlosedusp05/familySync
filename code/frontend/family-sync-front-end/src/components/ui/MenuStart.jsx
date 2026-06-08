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
      .filter((ev) => ev !== null && ev !== undefined)
      .map((ev) => {
        let dateObj;
        if (ev?.data && ev.data.includes("/")) {
          const [dia, mes, ano] = ev.data.split("/");
          dateObj = new Date(ano, mes - 1, dia);
        } else if (ev?.data) {
          dateObj = new Date(ev.data);
        } else {
          dateObj = new Date(0);
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

  const cardLista = (
    <div
      className={`w-full h-full flex items-center justify-center gap-2 md:gap-3 xl:gap-4 2xl:gap-5 bg-orange py-5 md:py-6 xl:py-8 2xl:py-10 rounded-2xl ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
      onMouseEnter={prefetchRoutes.list}
      onClick={() => navigate("/dashboard/lists")}
    >
      <img
        className="h-14 sm:h-20 md:h-12 xl:h-16 2xl:h-20 object-contain"
        src={listIcon}
        alt="Icon List"
      />
      <p className="hidden font-bold text-xl md:text-lg lg:text-2xl md:block xl:text-3xl 2xl:text-4xl text-white flex-wrap">
        Lista <br /> Compartilhada
      </p>
    </div>
  );

  const cardCalendario = (
    <div
      className={`w-full h-full flex flex-col justify-center xl:justify-start items-center rounded-2xl md:pt-5 md:px-3 lg:px-5 xl:items-start xl:pt-6 xl:px-7 2xl:pt-8 2xl:px-9 bg-default gap-2 xl:gap-3 2xl:gap-4 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
      onMouseEnter={prefetchRoutes.calendar}
      onClick={() => navigate("/dashboard/calendar")}
    >
      <div className="hidden md:flex w-full rounded-2xl overflow-hidden bg-white relative">
        {props.isLoadingEvents ? (
          <div className="flex w-full">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex flex-col w-full min-w-0">
                <div className="bg-brown-dark py-1.5 md:py-1.5 2xl:py-2 px-1 flex justify-center border-r border-white/20">
                  <div className="h-3 md:h-2 lg:h-3 w-3/4 bg-white/30 rounded animate-pulse"></div>
                </div>
                <div
                  className={`flex justify-between items-center p-1.5 md:p-1.5 lg:p-2 xl:p-2.5 2xl:p-3 bg-white ${
                    i !== 3 ? "border-r-2 border-brown-dark/20" : ""
                  }`}
                >
                  <div className="h-2 md:h-1.5 lg:h-2 w-[40%] bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-2 md:h-1.5 lg:h-2 w-[40%] bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          upcomingEvents.map((ev, i) => {
            const tituloLimitado = ev?.titulo
              ? ev.titulo.length > 8
                ? `${ev.titulo.substring(0, 8)}...`
                : ev.titulo
              : "Livre";

            return (
              <div key={i} className="flex flex-col w-full min-w-0">
                <div className="bg-brown-dark text-white font-bold text-[12px] md:text-[10px] lg:text-[14px] xl:text-[14px] 2xl:text-[15px] text-center py-1 md:py-1.5 2xl:py-2 whitespace-nowrap overflow-hidden text-ellipsis px-1">
                  {tituloLimitado}
                </div>
                <div
                  className={`flex justify-between p-1.5 md:p-1.5 lg:p-2 xl:p-2.5 2xl:p-3 text-terracota text-[10px] md:text-[8px] lg:text-[11px] xl:text-[8px] 2xl:text-[12px] font-medium ${
                    i !== 3 ? "border-r-2 border-brown-dark" : ""
                  }`}
                >
                  <p>{ev?.hora ? ev.hora : "--:--"}</p>
                  <p>{ev?.data ? ev.data.substring(0, 5) : "--/--"}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center gap-2 text-orange-dark text-xl md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
        <img
          className="h-16 sm:h-24 md:h-12 lg:h-16 xl:h-18 2xl:h-22 object-contain"
          src={calendarIcon}
          alt="Calendar Icon"
        />
        <h2 className="hidden md:block">Calendário</h2>
      </div>
    </div>
  );

  const cardAddFamilia = (
    <div
      className={`w-full h-full flex flex-row items-center justify-center p-4 md:p-5 xl:p-9 2xl:p-12 rounded-2xl bg-orange-dark ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
      onMouseEnter={prefetchRoutes.newFamily}
      onClick={() => navigate("/dashboard/family/add")}
    >
      <img
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain"
        src={plusIcon}
        alt="Plus Icon"
      />
      <h2 className="md:hidden text-white font-bold text-xl sm:text-2xl ml-3">
        Formar família
      </h2>
    </div>
  );

  const cardFinanceiro = (
    <div
      className={`w-full h-full justify-center items-center flex flex-col gap-3 md:gap-4 xl:gap-5 2xl:gap-6 xl:justify-start rounded-2xl bg-terracota p-3 md:p-4 xl:p-5 2xl:p-6 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
      onMouseEnter={prefetchRoutes.financier}
      onClick={() => navigate("/dashboard/finance")}
    >
      <div
        className="hidden md:flex gap-[4%] bg-default w-full items-end rounded-2xl relative"
        style={{ height: "55%" }}
      >
        {[30, 40, 90, 85, 90, 60, 80, 75].map((h, i) => (
          <div
            key={i}
            className={`flex-1 bg-brown-dark ${
              i === 0 ? "rounded-bl-2xl" : ""
            } ${i === 7 ? "rounded-br-2xl" : ""}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="flex gap-2 md:gap-3 2xl:gap-4 items-center text-white font-semibold">
        <img
          className="h-15 sm:h-20 md:h-12 lg:h-16 xl:h-18 2xl:h-22 object-contain"
          src={piggyBank}
          alt="Piggy Icon"
        />
        <h2 className="hidden md:block text-2xl md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl leading-none">
          Gerenciamento <br /> Financeiro
        </h2>
      </div>
    </div>
  );

  const cardGerenciar = (
    <div
      className={`w-full h-full flex md:bg-yellow-cream rounded-2xl ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
      onMouseEnter={prefetchRoutes.manageFamily}
      onClick={() => navigate("/dashboard/family")}
    >
      <div className="h-full w-full md:w-1/3 rounded-2xl md:rounded-r-none flex p-3 md:p-3 lg:p-4 xl:p-5 2xl:p-7 items-center justify-center bg-orange">
        <img
          className="h-16 sm:h-36 md:h-12 lg:h-16 xl:h-20 2xl:h-26 object-contain"
          src={settingsIcon}
          alt="Settings Icon"
        />
      </div>
      <div className="h-full hidden md:flex md:w-2/3 items-center justify-center px-4 md:px-3 lg:px-6 xl:px-8 2xl:px-10">
        <h2 className="text-orange text-[2rem] md:text-[1.3rem] lg:text-[1.8rem] xl:text-[2.2rem] 2xl:text-[3rem] leading-none font-bold text-start">
          Gerenciar <br /> Familia
        </h2>
      </div>
    </div>
  );

  const cardInfo = (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-brown-dark rounded-2xl gap-2 md:gap-2 xl:gap-4 2xl:gap-5 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
      onMouseEnter={prefetchRoutes.infoFamiliar}
      onClick={() => navigate("/dashboard/family/info")}
    >
      <div className="flex items-center justify-center md:justify-start md:pl-3 lg:pl-6 xl:pl-8 w-full gap-2 md:gap-1.5 lg:gap-2 mt-2 md:mt-1 lg:mt-2">
        <img
          className="h-15 sm:h-24 md:h-7 lg:h-12 xl:h-14 2xl:h-16 object-contain"
          src={infoIcon}
          alt="Info Icon"
        />
        <h2 className="hidden md:block text-white text-lg md:text-[0.7rem] lg:text-[1.1rem] xl:text-[1.2rem] 2xl:text-xl font-bold leading-tight">
          Informações <br /> Familiar
        </h2>
      </div>

      <div className="w-[82%] h-auto min-h-[50%] md:w-[94%] lg:w-[82%] bg-terracota rounded-2xl md:rounded-lg lg:rounded-2xl hidden md:flex flex-col px-3 md:px-2 lg:px-4 py-3 md:py-1.5 lg:py-3 mb-3 md:mb-1.5 lg:mb-3 relative">
        <h3 className="font-bold text-brown-dark text-[15px] md:text-[10px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px] leading-tight">
          Principais informações:
        </h3>

        <div className="mt-1 font-bold text-white text-[11px] md:text-[9px] lg:text-[12px] xl:text-[13px] 2xl:text-[15px] leading-tight">
          {props.isLoadingInfos ? (
            <div className="flex flex-col gap-1.5 md:gap-1 w-full mt-1">
              <div className="h-3 md:h-2 lg:h-3 bg-white/30 rounded w-full animate-pulse"></div>
              <div className="h-3 md:h-2 lg:h-3 bg-white/30 rounded w-5/6 animate-pulse"></div>
              <div className="h-3 md:h-2 lg:h-3 bg-white/30 rounded w-4/6 animate-pulse"></div>
            </div>
          ) : (
            <ul>
              {recentInfos.length > 0 ? (
                recentInfos.map((info, index) => (
                  <li key={index} className="truncate">
                    {info?.descricao || info?.titulo || info}
                  </li>
                ))
              ) : (
                <li>Você ainda não tem informações cadastradas!</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <LargeCard
      key={props.userData?.nome}
      color={"bg-yellow-light"}
      p={"p-0 bg-orange overflow-hidden"}
      size={
        "h-[98%] w-full md:h-[88%] md:w-[85%] xl:h-[82%] xl:w-[76%] 2xl:h-[80%] 2xl:w-[72%]"
      }
      data-aos="fade-up"
    >
      <div className="pt-6 pb-8 px-6 sm:px-10 md:py-8 md:px-12 xl:pt-10 xl:pb-6 xl:px-20 2xl:pt-12 2xl:pb-10 2xl:px-28 flex flex-col justify-start items-start lg:items-stretch gap-2 md:gap-3 xl:gap-4 2xl:gap-5 h-full w-full relative overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Cabeçalho */}
        <div className="flex flex-col justify-center items-start xl:justify-between xl:flex-row xl:items-end md:gap-4 2xl:gap-8 shrink-0 w-full">
          <div className="flex flex-col justify-center items-start">
            <h2
              className="text-xl font-bold text-orange md:text-2xl xl:text-3xl 2xl:text-4xl"
              data-aos="fade-down"
              data-aos-delay="400"
            >
              <span className="ajuste-desfoque">
                Olá, {props.userData?.nome}
              </span>
            </h2>
            <p
              className="text-base font-bold text-default md:text-lg xl:text-xl 2xl:text-2xl"
              data-aos="fade-down"
              data-aos-delay="450"
            >
              <span className="ajuste-desfoque">{props.userData?.email}</span>
            </p>
          </div>
          <h2
            className="text-2xl font-bold text-orange md:text-3xl xl:text-3xl 2xl:text-4xl"
            data-aos="fade-down"
            data-aos-delay="450"
          >
            <span className="ajuste-desfoque">
              {props.userData?.nomeFamilia}
            </span>
          </h2>
        </div>

        {/* Layout Desktop */}
        <div className="hidden lg:flex flex-col h-full gap-4 relative mt-2 w-full">
          <div className="grid grid-cols-10 gap-2 md:gap-3 xl:gap-4 xl:flex-[0.48] 2xl:gap-5 2xl:flex-[0.48] flex-[0.85]">
            <div
              className="col-span-4"
              data-aos="fade-right"
              data-aos-delay="400"
            >
              {cardLista}
            </div>
            <div
              className="col-span-4"
              data-aos="fade-down"
              data-aos-delay="500"
            >
              {cardCalendario}
            </div>
            <div
              className="col-span-2"
              data-aos="fade-left"
              data-aos-delay="600"
            >
              {cardAddFamilia}
            </div>
          </div>

          <div className="grid grid-cols-11 gap-2 md:gap-3 xl:flex-[0.52] 2xl:gap-5 2xl:flex-[0.52] flex-[1.1]">
            <div
              className="col-span-4"
              data-aos="fade-right"
              data-aos-delay="700"
            >
              {cardFinanceiro}
            </div>
            <div className="col-span-4" data-aos="fade-up" data-aos-delay="800">
              {cardGerenciar}
            </div>
            <div
              className="col-span-3"
              data-aos="fade-left"
              data-aos-delay="900"
            >
              {cardInfo}
            </div>
          </div>
        </div>

        {/* LAYOUT MOBILE & TABLET */}
        <div className="grid grid-cols-2 grid-rows-4 md:grid-rows-3 flex-1 gap-2 md:gap-4 mt-2 lg:hidden w-full relative min-h-[400px] md:min-h-125 pb-4">
          <div
            className="col-span-1 order-1 md:order-1"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            {cardLista}
          </div>
          <div
            className="col-span-1 order-2 md:order-3"
            data-aos="fade-left"
            data-aos-delay="500"
          >
            {cardFinanceiro}
          </div>
          <div
            className="col-span-2 md:col-span-1 order-3 md:order-4"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            {cardAddFamilia}
          </div>
          <div
            className="col-span-1 order-4 md:order-6"
            data-aos="fade-right"
            data-aos-delay="700"
          >
            {cardInfo}
          </div>
          <div
            className="col-span-1 order-5 md:order-2"
            data-aos="fade-left"
            data-aos-delay="800"
          >
            {cardCalendario}
          </div>
          <div
            className="col-span-2 md:col-span-1 order-6 md:order-5"
            data-aos="fade-up"
            data-aos-delay="900"
          >
            {cardGerenciar}
          </div>
        </div>
      </div>
    </LargeCard>
  );
}

export default memo(MenuStart);
