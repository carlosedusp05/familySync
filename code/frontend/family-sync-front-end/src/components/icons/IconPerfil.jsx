import { perfilIconOrange, perfilIconWhite } from "../../assets";

function IconPerfil({ is_white_backgroud }) {
  const color = is_white_backgroud ? perfilIconOrange : perfilIconWhite;
  const style = is_white_backgroud ? "border border-default" : "bg-orange-dark";

  return (
    <div
      className={`rounded-full p-4 flex items-center justify-center transition-all duration-300  ${style}`}
    >
      <img
        src={color}
        alt="Icon Perfil"
        className="w-full h-full object-contain"
        draggable="false"
      />
    </div>
  );
}

export default IconPerfil;
