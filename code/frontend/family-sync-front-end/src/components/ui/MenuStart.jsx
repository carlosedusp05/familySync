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
      p={"py-8 px-28"}
      size={"h-[88%] w-[82%]"}
      data-aos="fade-up"
    >
      <div className="flex flex-col gap-2 h-full">
        <div className="flex justify-between items-center gap-4 pb-1">
          <div className="flex flex-col">
            <h2
              className="text-2xl font-bold text-orange"
              data-aos="fade-down"
              data-aos-delay="400"
            >
              <span className="ajuste-desfoque">
                Olá, {props.userData.nome}
              </span>
            </h2>

            <p
              className="text-xl font-bold text-default"
              data-aos="fade-down"
              data-aos-delay="450"
            >
              <span className="ajuste-desfoque">{props.userData.email}</span>
            </p>
          </div>

          <h2
            className="text-3xl font-bold text-orange"
            data-aos="fade-down"
            data-aos-delay="450"
          >
            <span className="ajuste-desfoque">
              {props.userData.nomeFamilia}
            </span>
          </h2>
        </div>

        {/* Grid Div 1*/}
        <div className="grid grid-cols-10 gap-3 flex-[0.85] ">
          {/* Div Lista Compartilhada - WRAPPER */}
          <div
            className="col-span-4"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <div
              className={`w-full h-full flex items-center justify-center gap-3 bg-orange py-8 rounded-2xl ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.list}
              onClick={() => navigate("/dashboard/lists")}
            >
              <img className="h-18" src={listIcon} alt="Icon List" />

              <p className="font-bold text-4xl text-white flex-wrap">
                Lista <br /> Compartilhada
              </p>
            </div>
          </div>

          {/* Div Calendário - WRAPPER */}
          <div className="col-span-4" data-aos="fade-down" data-aos-delay="500">
            <div
              className={`w-full h-full flex flex-col rounded-2xl pt-4 px-7 bg-default gap-3 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.calendar}
              onClick={() => navigate("/dashboard/calendar")}
            >
              <div className="flex w-full rounded-2xl overflow-hidden bg-white">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col w-full">
                    <div className="bg-brown-dark text-white font-bold text-[16px] text-center py-2">
                      Título
                    </div>

                    <div
                      className={`flex justify-between p-3 text-terracota text-[13px] font-medium ${
                        i !== 4 ? "border-r-2 border-brown-dark" : ""
                      }`}
                    >
                      <p>20:00</p>
                      <p>01/01</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-orange-dark text-3xl font-bold">
                <img className="h-20" src={calendarIcon} alt="Calendar Icon" />
                <h2>Calendário</h2>
              </div>
            </div>
          </div>

          {/* Div Adicionar Familia - WRAPPER */}
          <div className="col-span-2" data-aos="fade-left" data-aos-delay="600">
            <div
              className={`w-full h-full flex items-center justify-center p-9 rounded-2xl bg-orange-dark ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.newFamily}
              onClick={() => navigate("/dashboard/family/add")}
            >
              <img className="w-[82%] h-[82%]" src={plusIcon} alt="Plus Icon" />
            </div>
          </div>
        </div>

        {/* Grid Div 2 */}
        <div className="grid grid-cols-11 gap-3 flex-[1.15]">
          {/* Div Gerenciamento Financeiro - WRAPPER */}
          <div
            className="col-span-4"
            data-aos="fade-right"
            data-aos-delay="700"
          >
            <div
              className={`w-full h-full flex flex-col gap-4 items-center rounded-2xl bg-terracota p-4 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
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
                    className={`flex-1 bg-brown-dark ${
                      i === 0 ? "rounded-bl-2xl" : ""
                    } ${i === 7 ? "rounded-br-2xl" : ""}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="flex gap-2 items-center text-2xl text-white font-semibold">
                <img className="h-18" src={piggyBank} alt="Piggy Icon" />

                <h2 className="text-4xl">
                  Gerenciamento <br /> Financeiro
                </h2>
              </div>
            </div>
          </div>

          {/* Gerenciar Familia - WRAPPER */}
          <div className="col-span-4" data-aos="fade-up" data-aos-delay="800">
            <div
              className={`w-full h-full flex bg-yellow-cream rounded-2xl ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.manageFamily}
              onClick={() => navigate("/dashboard/family")}
            >
              <div className="h-full flex p-4 rounded-l-2xl items-center justify-center bg-orange">
                <img className="h-20" src={settingsIcon} alt="Settings Icon" />
              </div>

              <div className="h-full flex items-center justify-center px-9">
                <h2 className="text-orange text-[3rem] leading-none font-bold">
                  Gerenciar <br /> Familia
                </h2>
              </div>
            </div>
          </div>

          {/* Div Informações Familiares - WRAPPER */}
          <div className="col-span-3" data-aos="fade-left" data-aos-delay="900">
            <div
              className={`w-full h-full flex flex-col items-center justify-center bg-brown-dark rounded-2xl gap-2 ${hover} ajuste-desfoque duration-300 ease-out hover:-translate-y-0.5 transition-all active:scale-90 active:brightness-90 cursor-pointer`}
              onMouseEnter={prefetchRoutes.infoFamiliar}
              onClick={() => navigate("/dashboard/family/info")}
            >
              <div className="flex items-center justify-center gap-2">
                <img className="h-20" src={infoIcon} alt="Info Icon" />

                <h2 className="text-white text-3xl font-bold">
                  Informações <br /> Familiar
                </h2>
              </div>

              <div className="w-[78%] h-[50%] bg-terracota rounded-2xl flex flex-col px-3 py-2">
                <h3 className="font-bold text-brown-dark text-[21px]">
                  Principais informações:
                </h3>

                <ul className="font-bold text-white text-[15px]">
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
