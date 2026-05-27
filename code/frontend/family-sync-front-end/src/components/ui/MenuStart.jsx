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
import { useEffect } from "react";

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

  return (
    <LargeCard
      key={props.userData.nome}
      color={"bg-yellow-light"}
      p={
        "py-6 pb-22 px-10 md:py-7 md:px-14 xl:pt-20 xl:pb-22 xl:px-26 bg-orange"
      }
      size={"h-[82%] w-[77%] md:h-[85%] md:w-[82%] xl:h-[78%] xl:w-[73%]"}
      data-aos="fade-up"
    >
      <div className="flex flex-col gap-2 md:gap-3 h-full">
        {/* Header */}
        <div className="flex justify-between items-end gap-3 md:gap-4 xl:gap-5">
          <div className="flex flex-col">
            <h2
              className="text-xl font-bold text-orange md:text-2xl xl:text-4xl"
              data-aos="fade-down"
              data-aos-delay="400"
            >
              <span className="ajuste-desfoque">
                Olá, {props.userData.nome}
              </span>
            </h2>

            <p
              className="text-base font-bold text-default md:text-xl xl:text-2xl"
              data-aos="fade-down"
              data-aos-delay="450"
            >
              <span className="ajuste-desfoque">{props.userData.email}</span>
            </p>
          </div>

          <h2
            className="text-2xl font-bold text-orange md:text-3xl xl:text-4xl"
            data-aos="fade-down"
            data-aos-delay="450"
          >
            <span className="ajuste-desfoque">
              {props.userData.nomeFamilia}
            </span>
          </h2>
        </div>

        {/* Grid Div 1 */}
        <div className="grid grid-cols-10 gap-2 flex-[0.85] md:gap-3 xl:gap-4 xl:flex-[0.3]">
          {/* Lista Compartilhada */}
          <div
            className="col-span-4"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <div
              className={`w-full h-full flex items-center justify-center gap-2 md:gap-3 bg-orange py-5 md:py-7 xl:py-10 rounded-2xl ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.list}
              onClick={() => navigate("/dashboard/lists")}
            >
              <img
                className="h-12 md:h-14 xl:h-28"
                src={listIcon}
                alt="Icon List"
              />
              <p className="font-bold text-2xl md:text-3xl xl:text-5xl text-white flex-wrap">
                Lista <br /> Compartilhada
              </p>
            </div>
          </div>

          {/* Calendário */}
          <div className="col-span-4" data-aos="fade-down" data-aos-delay="500">
            <div
              className={`w-full h-full flex flex-col rounded-2xl pt-5 px-4 md:pt-6 md:px-6 xl:px-9 bg-default gap-2 md:gap-3 xl:gap-4 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.calendar}
              onClick={() => navigate("/dashboard/calendar")}
            >
              <div className="flex w-full rounded-2xl overflow-hidden bg-white">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col w-full">
                    <div className="bg-brown-dark text-white font-bold text-[13px] md:text-[15px] xl:text-[19px] text-center py-1 md:py-2">
                      Título
                    </div>
                    <div
                      className={`flex justify-between p-2 md:p-3 text-terracota text-[11px] md:text-[12px] xl:text-[15px] font-medium ${
                        i !== 4 ? "border-r-2 border-brown-dark" : ""
                      }`}
                    >
                      <p>20:00</p>
                      <p>01/01</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-orange-dark text-2xl md:text-3xl xl:text-4xl font-bold">
                <img
                  className="h-14 md:h-17 xl:h-23"
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
              className={`w-full h-full flex items-center justify-center p-5 md:p-7 xl:p-12 rounded-2xl bg-orange-dark ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.newFamily}
              onClick={() => navigate("/dashboard/family/add")}
            >
              <img className="w-[82%] h-[82%]" src={plusIcon} alt="Plus Icon" />
            </div>
          </div>
        </div>

        {/* Grid Div 2 */}
        <div className="grid grid-cols-11 gap-2 md:gap-3 flex-[1.1] xl:flex-[0.6]">
          {/* Gerenciamento Financeiro */}
          <div
            className="col-span-4"
            data-aos="fade-right"
            data-aos-delay="700"
          >
            <div
              className={`w-full h-full flex flex-col gap-4 md:gap-6 items-center rounded-2xl bg-terracota p-4 md:p-5 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
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

              <div className="flex gap-3 items-center text-white font-semibold">
                <img
                  className="h-12 md:h-15 xl:h-22"
                  src={piggyBank}
                  alt="Piggy Icon"
                />
                <h2 className="text-3xl md:text-4xl xl:text-5xl leading-none">
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
              <div className="h-full flex p-3 md:p-4 xl:p-5 rounded-l-2xl items-center justify-center bg-orange">
                <img
                  className="h-14 md:h-17 xl:h-25"
                  src={settingsIcon}
                  alt="Settings Icon"
                />
              </div>
              <div className="h-full flex items-center justify-center px-5 md:px-7 xl:px-9">
                <h2 className="text-orange text-[2.2rem] md:text-[2.6rem] xl:text-[4rem] leading-none font-bold">
                  Gerenciar <br /> Familia
                </h2>
              </div>
            </div>
          </div>

          {/* Informações Familiares */}
          <div className="col-span-3" data-aos="fade-left" data-aos-delay="900">
            <div
              className={`w-full h-full flex flex-col items-center justify-center bg-brown-dark rounded-2xl gap-1 md:gap-2 xl:gap-3 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.infoFamiliar}
              onClick={() => navigate("/dashboard/family/info")}
            >
              <div className="flex items-center justify-start pl-6 md:pl-8 xl:pl-10 w-full gap-2">
                <img
                  className="h-14 md:h-17 xl:h-23"
                  src={infoIcon}
                  alt="Info Icon"
                />
                <h2 className="text-white text-xl md:text-2xl xl:text-3xl font-bold">
                  Informações <br /> Familiar
                </h2>
              </div>

              <div className="w-[78%] h-[50%] bg-terracota rounded-2xl flex flex-col px-2 md:px-3 py-2">
                <h3 className="font-bold text-brown-dark text-[17px] md:text-[19px] xl:text-[25px]">
                  Principais informações:
                </h3>
                <ul className="font-bold text-white text-[12px] md:text-[14px] xl:text-[18px]">
                  {Array.isArray(props.infos) && props.infos.length > 0 ? (
                    props.infos.map((info, index) => (
                      <li key={index}>{info.descricao || info}</li>
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

export default MenuStart;
