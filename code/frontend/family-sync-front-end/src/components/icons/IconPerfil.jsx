import { perfilIconOrange, perfilIconWhite, familyIcon } from "../../assets";
import { useNavigate } from "react-router-dom";

function IconPerfil({
  is_white_backgroud,
  is_family_icon,
  another_size,
  fotoUrl,
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

  const size = another_size ? another_size : "w-12 h-12";

  return (
    <div
      className={`rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden shrink-0 ${
        fotoUrl ? "border-2 border-orange-dark" : `p-2 ${style}`
      } ${size}`}
      onMouseEnter={prefetchPerfil}
      onClick={onClickNew ? onClickNew : () => navigate("/dashboard/profile")}
    >
      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt="Foto do Usuário"
          className="object-cover w-full h-full"
          draggable="false"
        />
      ) : (
        <img
          src={color}
          alt="Icon Perfil"
          className="object-contain w-full h-full p-3"
          draggable="false"
        />
      )}
    </div>
  );
}

export default IconPerfil;
