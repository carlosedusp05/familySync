import { perfilIconOrange, perfilIconWhite, familyIcon } from "../../assets";
import { useNavigate } from "react-router-dom";

function IconPerfil({
  is_white_backgroud,
  is_family_icon,
  another_size,
  onClickNew,
}) {
  const navigate = useNavigate();

  const prefetchPerfil = () => {
    import("../../screens/PerfilScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const color = is_family_icon
    ? familyIcon
    : is_white_backgroud
      ? perfilIconOrange
      : perfilIconWhite;
  const style = is_family_icon
    ? "bg-white"
    : is_white_backgroud
      ? "border border-default"
      : "bg-orange-dark";

  const size = another_size ? another_size : "w-10 h-10";

  return (
    <div
      className={`rounded-full p-4 flex items-center justify-center transition-all duration-300  ${style} cursor-pointer hover:scale-110`}
      onMouseEnter={prefetchPerfil}
      onClick={onClickNew ? onClickNew : () => navigate("/dashboard/profile")}
    >
      <img
        src={color}
        alt="Icon Perfil"
        className={`${size} object-contain`}
        draggable="false"
      />
    </div>
  );
}

export default IconPerfil;
