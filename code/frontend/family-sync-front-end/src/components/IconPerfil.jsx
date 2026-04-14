import { perfilIconOrange, perfilIconWhite } from "../assets";

function IconPerfil({ is_orange }) {
  const color = is_orange ? perfilIconOrange : perfilIconWhite;
  const style = is_orange ? "border border-default" : "bg-orange-dark";

  return (
    <div
      className={`p-6 rounded-[500px] flex items-center justify-center ${style}`}
    >
      <img
        src={color}
        alt=" Icon Perfil"
        className="w-full h-full"
        draggable="false"
      />
    </div>
  );
}

export default IconPerfil;
