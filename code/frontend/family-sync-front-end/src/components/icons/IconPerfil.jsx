import { perfilIconOrange, perfilIconWhite, familyIcon } from "../../assets";

function IconPerfil({ is_white_backgroud, is_family_icon, another_size }) {
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
      className={`rounded-full p-4 flex items-center justify-center transition-all duration-300  ${style}`}
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
