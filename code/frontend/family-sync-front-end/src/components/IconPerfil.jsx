import { perfilIconOrange, perfilIconWhite } from "../assets";

function IconPerfil({ is_orange }) {
  const color = is_orange ? perfilIconOrange : perfilIconWhite;
  const style = is_orange ? "border border-default" : "bg-orange-dark";

  return (
    <div
      className={`rounded-[50%] p-3 flex items-center justify-center ${style}`}
    >
      <img
        src={color}
        alt=" Icon Perfil"
        className="max-w-full max-h-full"
        draggable="false"
      />
    </div>
  );
}

export default IconPerfil;
