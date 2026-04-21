import { logoIcon } from "../../assets";

function IconFamilySync({ is_small = false }) {
  const size = is_small ? "w-40 h-auto" : "w-70 h-auto";
  return (
    <img
      src={logoIcon}
      alt="Logotipo FamilySync"
      className={size}
      draggable="false"
    ></img>
  );
}

export default IconFamilySync;
