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
    <div className="p-4 gap-10 bg-orange flex flex-col items-center justify-center g-3">
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
