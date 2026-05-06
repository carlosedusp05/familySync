import { logoIcon } from "../../assets";

function IconFamilySync({ ...props }) {
  return (
    <img
      src={logoIcon}
      alt="Logotipo FamilySync"
      {...props}
      className={`w-100 h-auto ${props.className || ""}`}
      draggable="false"
    />
  );
}

export default IconFamilySync;
