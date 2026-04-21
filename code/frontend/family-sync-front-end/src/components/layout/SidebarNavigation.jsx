import ImgSidebar from "../icons/ImgSidebar";
import {
  listIcon,
  piggyBank,
  calendarIcon,
  infoIcon,
  plusIcon,
  settingsIcon,
} from "../../assets";

function SideBarNavegation({ currentPage }) {
  return (
    <div className="h-full p-1 gap-3 bg-orange relative top-0 left-0 flex flex-col items-center justify-center g-3">
      <ImgSidebar
        isPage={currentPage === "lista"}
        src={listIcon}
        alt="Lista"
      ></ImgSidebar>

      <ImgSidebar
        isPage={currentPage === "financas"}
        src={piggyBank}
        alt="Finanças"
      ></ImgSidebar>

      <ImgSidebar
        isPage={currentPage === "calendario"}
        src={calendarIcon}
        alt="Calendário"
      ></ImgSidebar>

      <ImgSidebar
        isPage={currentPage === "informacoes_familiares"}
        src={infoIcon}
        alt="Informações Familiares"
      ></ImgSidebar>

      <ImgSidebar
        isPage={currentPage === "adicionar_familia"}
        src={plusIcon}
        alt="Adicionar Familia"
      ></ImgSidebar>

      <ImgSidebar
        isPage={currentPage === "configuracoes"}
        src={settingsIcon}
        alt="Configurações"
      ></ImgSidebar>
    </div>
  );
}

export default SideBarNavegation;
