import { useLocation, Link } from "react-router-dom";
import ImgSidebar from "../icons/ImgSidebar";
import {
  listIcon,
  piggyBank,
  calendarIcon,
  infoIcon,
  plusIcon,
  settingsIcon,
} from "../../assets";

function SideBarNavegation() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Criamos uma variável com as classes do Tailwind para não repetir código.
  // O duration-300 e ease-in-out vão deixar o hover super suave!
  const linkClass =
    "hover:scale-110 transition-transform duration-300 ease-in-out";

  return (
    <div className="p-4 gap-10 bg-orange flex flex-col items-center justify-center g-3">
      <Link to="/dashboard/lists" className={linkClass}>
        <ImgSidebar
          isPage={currentPath.includes("/dashboard/lists")}
          src={listIcon}
          alt="Lista"
        />
      </Link>

      <Link to="/dashboard/finance" className={linkClass}>
        <ImgSidebar
          isPage={currentPath.includes("/dashboard/finance")}
          src={piggyBank}
          alt="Finanças"
        />
      </Link>

      <Link to="/dashboard/calendar" className={linkClass}>
        <ImgSidebar
          isPage={currentPath.includes("/dashboard/calendar")}
          src={calendarIcon}
          alt="Calendário"
        />
      </Link>

      {/* Daqui para baixo, mudamos de .includes() para === para evitar o bug de sobreposição! */}
      <Link to="/dashboard/family/info" className={linkClass}>
        <ImgSidebar
          isPage={currentPath === "/dashboard/family/info"}
          src={infoIcon}
          alt="Informações Familiares"
        />
      </Link>

      <Link to="/dashboard/family/add" className={linkClass}>
        <ImgSidebar
          isPage={currentPath === "/dashboard/family/add"}
          src={plusIcon}
          alt="Adicionar Familia"
        />
      </Link>

      <Link to="/dashboard/family" className={linkClass}>
        <ImgSidebar
          isPage={currentPath === "/dashboard/family"}
          src={settingsIcon}
          alt="Configurações"
        />
      </Link>
    </div>
  );
}

export default SideBarNavegation;
