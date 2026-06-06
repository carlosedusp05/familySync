import { logoIcon } from "../../assets";

function IconFamilySync({ ...props }) {
  return (
    <img
      src={logoIcon}
      alt="Logotipo FamilySync"
      {...props}
      className={`w-70 max-lg:w-70 2xl:w-90  max-sm:w-40 h-auto ${props.className || ""}`}
      draggable="false"
    />
  );
}

export default IconFamilySync;
