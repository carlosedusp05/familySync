import { useLocation, Link } from "react-router-dom";
import { motion, LayoutGroup } from "framer-motion";
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
    <div
      className="p-4 gap-10 xl:gap-2 bg-orange flex flex-col items-center justify-center relative transform-gpu
      max-md:flex-row max-md:fixed max-md:bottom-6 max-md:left-4 max-md:right-4 max-md:h-auto max-md:py-3 max-md:px-4 max-md:gap-1 max-md:justify-between max-md:rounded-[1.5rem] max-md:z-[100] max-md:shadow-xl"
    >
      <LayoutGroup>
        {navLinks.map((link) => {
          const isActive = checkIsPage(link);

          return (
            <Link
              key={link.path}
              to={link.path}
              className="relative p-2 hover:scale-110 transition-transform duration-300 ease-in-out flex justify-center items-center max-md:flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeBackground"
                  initial={false}
                  className="absolute inset-0 bg-black/20 rounded-2xl max-md:bg-white max-md:rounded-[1.2rem] max-md:shadow-sm"
                  style={{ willChange: "transform" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                  }}
                />
              )}
              <div className="relative z-10 flex justify-center items-center w-full">
                <ImgSidebar isPage={isActive} src={link.icon} alt={link.alt} />
              </div>
            </Link>
          );
        })}
      </LayoutGroup>
    </div>
  );
}

export default SideBarNavegation;
