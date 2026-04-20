import { logoIcon } from "../../assets";

function IconFamilySync({ is_small = false }) {
  const size = is_small ? "w-72.25 h-11.5" : "w-112.5  h-18.25";
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
