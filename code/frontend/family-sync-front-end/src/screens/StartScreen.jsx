import {
  imageBackground,
  listIcon,
  calendarIcon,
  plusIcon,
  piggyBank,
  settingsIcon,
  infoIcon,
} from "../assets";
import DefaultHeader from "../components/layout/DefaultHeader";
import BackgroundImage from "../components/ui/BackgroundImage";
import LargeCard from "../components/ui/LargeCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function PrincipalScreen(props) {
  const hover = "transition-all duration-400 hover:scale-103 transition-ease";
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    nome: "Usuário",
    email: "carregando...",
  });

  useEffect(() => {
    // 1. Lógica de carregar dados do usuário
    const savedUser = localStorage.getItem("@FamilySync:user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const nomeFormatado = parsedUser.nome
          ? parsedUser.nome
              .toLowerCase()
              .split(" ")
              .map(
                (palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1),
              )
              .join(" ")
          : "Usuário";

        setUserData({
          nome: nomeFormatado,
          email: parsedUser.email || "E-mail não encontrado",
        });
      } catch (error) {
        console.error("Erro ao converter dados do localStorage", error);
      }
    }

    // 2. Lógica para disparar a Splash Screen apenas uma vez por sessão
    const splashRodou = sessionStorage.getItem("@FamilySync:splashRodou");

    if (!splashRodou) {
      // Dispara o evento que o RootLayout está ouvindo
      window.dispatchEvent(new Event("startSplash"));
      // Salva no sessionStorage para não repetir até fechar a aba
      sessionStorage.setItem("@FamilySync:splashRodou", "true");
    }
  }, []);

  // Prefetch functions
  const prefetchList = () => {
    import("./ListScreen").catch(() => console.log("Erro ao pré-carregar"));
  };

  const prefetchCalendar = () => {
    import("./CalendarScreen").catch(() => console.log("Erro ao pré-carregar"));
  };

  const prefetchNewFamily = () => {
    import("./AddFamilyScreen").catch(() =>
      console.log("Erro ao pré-carregar"),
    );
  };

  const prefetchFinancier = () => {
    import("./FinancierScreen").catch(() =>
      console.log("Erro ao pré-carregar"),
    );
  };

  const prefetchManageFamily = () => {
    import("./ManageFamily").catch(() => console.log("Erro ao pré-carregar"));
  };

  const prefetchInfoFamiliar = () => {
    import("./InfoFamiliarScreen").catch(() =>
      console.log("Erro ao pré-carregar"),
    );
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <DefaultHeader />
      <div className="w-full flex justify-center items-center h-full ">
        <LargeCard
          color={"bg-yellow-light"}
          p={"pt-25 pb-10 px-30"}
          size={"h-[82%] w-[77%]"}
        >
          <div className="flex flex-col gap-1 justify-center h-full">
            <div className="flex justify-between items-center gap-5">
              <div className="flex flex-col">
                <h2 className="text-4xl font-bold text-orange">
                  Olá, {userData.nome}
                </h2>
                <p className="text-2xl font-bold text-default">
                  {userData.email}
                </p>
              </div>
              <h2 className="text-4xl font-bold text-orange">
                Nome da Familia
              </h2>
            </div>

            {/* Grid Div 1*/}
            <div className="grid grid-cols-10 gap-4">
              {/* Div Lista Compartilhada */}
              <div
                className={`col-span-4 flex items-center justify-center gap-4 h-[80%] bg-orange py-10 rounded-2xl ${hover} duration-300 ease-out hover:-translate-y-0.5
                transition-all active:scale-90 active:brightness-90 cursor-pointer`}
                onMouseEnter={prefetchList}
                onClick={() => navigate("/dashboard/lists")}
              >
                <img className="h-27" src={listIcon} alt="Icon List" />
                <p className="font-bold text-6xl text-white flex-wrap">
                  Lista
                  <br />
                  Compartilhada
                </p>
              </div>

              {/* Div Calendário */}
              <div
                className={`flex flex-col col-span-4 rounded-2xl pt-5 px-9 h-[80%] bg-default gap-4 ${hover} duration-300 ease-out hover:-translate-y-0.5
                transition-all active:scale-90 active:brightness-90 cursor-pointer`}
                onMouseEnter={prefetchCalendar}
                onClick={() => navigate("/dashboard/calendar")}
              >
                <div className="flex w-full rounded-2xl overflow-hidden bg-white">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col w-full">
                      <div className="bg-brown-dark text-white font-bold text-[19px] text-center py-2">
                        Título
                      </div>
                      <div
                        className={`flex justify-between p-4 text-terracota text-[15px] font-medium ${i !== 4 ? "border-r-2 border-brown-dark" : ""}`}
                      >
                        <p>20:00</p>
                        <p>01/01</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-orange-dark text-4xl font-bold">
                  <img
                    className="h-25"
                    src={calendarIcon}
                    alt="Calendar Icon"
                  />
                  <h2>Calendário</h2>
                </div>
              </div>

              {/* Div Adicionar Familia */}
              <div
                className={`flex h-[80%] items-center justify-center col-span-2 p-12 rounded-2xl bg-orange-dark ${hover} duration-300 ease-out hover:-translate-y-0.5
                transition-all active:scale-90 active:brightness-90 cursor-pointer`}
                onMouseEnter={prefetchNewFamily}
                onClick={() => navigate("/dashboard/family/add")}
              >
                <img
                  className="w-[90%] h-[90%]"
                  src={plusIcon}
                  alt="Plus Icon"
                />
              </div>
            </div>

            {/* Grid Div 2 */}
            <div className="grid grid-cols-11 gap-4 h-full -mt-[3%]">
              {/* Div Gerenciamento Financeiro */}
              <div
                className={`flex flex-col col-span-4 gap-5 items-center rounded-2xl color bg-terracota p-5 h-[80%] ${hover} duration-300 ease-out hover:-translate-y-0.5
                transition-all active:scale-90 active:brightness-90 cursor-pointer`}
                onMouseEnter={prefetchFinancier}
                onClick={() => navigate("/dashboard/finance")}
              >
                <div className="flex gap-[4.81%] bg-default w-full h-[50%] items-end rounded-2xl">
                  <div className="w-12 rounded-bl-2xl bg-brown-dark h-[30%]"></div>
                  <div className="w-12 bg-brown-dark h-[40%]"></div>
                  <div className="w-12 bg-brown-dark h-[90%]"></div>
                  <div className="w-12 bg-brown-dark h-[85%]"></div>
                  <div className="w-12 bg-brown-dark h-[90%]"></div>
                  <div className="w-12 bg-brown-dark h-[60%]"></div>
                  <div className="w-12 bg-brown-dark h-[80%]"></div>
                  <div className="w-12 rounded-br-2xl bg-brown-dark h-[75%]"></div>
                </div>
                <div className="flex gap-3 items-center text-3xl text-white font-semibold">
                  <img className="h-24" src={piggyBank} alt="Piggy Icon" />
                  <h2 className="text-5xl">
                    Gerenciamento <br /> Financeiro
                  </h2>
                </div>
              </div>

              {/* Gerenciar Familia */}
              <div
                className={`flex col-span-4 h-[80%] bg-yellow-cream rounded-2xl ${hover} duration-300 ease-out hover:-translate-y-0.5
                transition-all active:scale-90 active:brightness-90 cursor-pointer`}
                onMouseEnter={prefetchManageFamily}
                onClick={() => navigate("/dashboard/family")}
              >
                <div className="h-full flex p-5 rounded-l-2xl items-center justify-center bg-orange">
                  <img
                    className="h-25"
                    src={settingsIcon}
                    alt="Settings Icon"
                  />
                </div>
                <div className="h-full flex items-center justify-center px-12">
                  <h2 className="text-orange text-[4rem] leading-none font-bold">
                    Gerenciar <br /> Familia
                  </h2>
                </div>
              </div>

              {/* Div Informações Familiares */}
              <div
                className={`flex flex-col items-center justify-center col-span-3 h-[80%] bg-brown-dark rounded-2xl gap-3 ${hover} duration-300 ease-out hover:-translate-y-0.5
                transition-all active:scale-90 active:brightness-90 cursor-pointer`}
                onMouseEnter={prefetchInfoFamiliar}
                onClick={() => navigate("/dashboard/family/info")}
              >
                <div className="flex items-center justify-center gap-2">
                  <img className="h-25" src={infoIcon} alt="Info Icon" />
                  <h2 className="text-white text-4xl font-bold">
                    Informações <br /> Familiar
                  </h2>
                </div>
                <div className="w-[78%] h-[50%] bg-terracota rounded-2xl flex flex-col px-3 py-2">
                  <h3 className="font-bold text-brown-dark text-[25px]">
                    Principais Alergias:
                  </h3>
                  <ul className="font-bold text-white text-[18px]">
                    {(
                      props.alergias || [
                        "Você ainda não tem alergias cadastradas!",
                      ]
                    ).map((alergia, index) => (
                      <li key={index}>{alergia}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </LargeCard>
      </div>
    </div>
  );
}

export default PrincipalScreen;
