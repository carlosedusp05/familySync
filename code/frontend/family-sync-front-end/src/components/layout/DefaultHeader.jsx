import IconFamilySync from "../icons/IconFamilySync";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import { notificationsIcon } from "../../assets";

function DefaultHeader({ disconnected }) {
  const size = disconnected ? "h-16" : "h-28";
  const imgsize = disconnected ? true : false;
  const children = disconnected ? (
    <div className="flex gap-15 ">
      <DefaultButton text="LOGIN" />
      <DefaultButton text="CADASTRAR" />
    </div>
  ) : (
    <div className="flex gap-6 items-center justify-center">
      <IconPerfil is_white_backgroud={false} />
      <div className="bg-orange-dark flex items-center justify-center h-fit p-2 rounded-lg">
        <img
          className="w-6 h-6"
          src={notificationsIcon}
          alt="Notificações"
          draggable={false}
        />
      </div>
    </div>
  );

  return (
    <header
      className={`w-full ${size}  flex justify-between items-center bg-white px-8`}
    >
      <IconFamilySync is_small={imgsize} />
      {children}
    </header>
  );
}

export default DefaultHeader;
