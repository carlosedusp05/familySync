import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  const navLinks = [
    { path: "/dashboard/lists", icon: listIcon, alt: "Lista" },
    { path: "/dashboard/finance", icon: piggyBank, alt: "Finanças" },
    { path: "/dashboard/calendar", icon: calendarIcon, alt: "Calendário" },
    {
      path: "/dashboard/family/info",
      icon: infoIcon,
      alt: "Informações",
      exact: true,
    },
    {
      path: "/dashboard/family/add",
      icon: plusIcon,
      alt: "Adicionar",
      exact: true,
    },
    {
      path: "/dashboard/family",
      icon: settingsIcon,
      alt: "Configurações",
      exact: true,
    },
  ];

  const checkIsPage = (link) => {
    return link.exact
      ? currentPath === link.path
      : currentPath.includes(link.path);
  };

  return (
    <div className="p-4 gap-10 bg-orange flex flex-col items-center justify-center relative">
      {navLinks.map((link) => {
        const isActive = checkIsPage(link);

        return (
          <Link
            key={link.path}
            to={link.path}
            className="relative p-2 hover:scale-110 transition-transform duration-300 ease-in-out"
          >
            {isActive && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-black/20 rounded-2xl"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <div className="relative z-10">
              <ImgSidebar isPage={isActive} src={link.icon} alt={link.alt} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default SideBarNavegation;
