import { logoIcon } from "../../assets";

function IconFamilySync({ ...props }) {
  return (
    <img
      src={logoIcon}
      alt="Logotipo FamilySync"
      {...props}
      className={`w-80 max-lg:w-70 max-sm:w-50 h-auto ${props.className || ""}`}
      draggable="false"
    />
  );
}

export default IconFamilySync;
