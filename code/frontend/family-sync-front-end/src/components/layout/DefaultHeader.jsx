import IconFamilySync from "../icons/IconFamilySync";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import { notificationsIcon } from "../../assets";

function DefaultHeader({ disconnected }) {
  const size = disconnected ? "h-[10%]" : "h-[15%]";
  const imgsize = disconnected ? true : false;
  const children = disconnected ? (
    <div className="flex gap-15 ">
      <DefaultButton text="LOGIN" />
      <DefaultButton text="CADASTRAR" />
    </div>
  ) : (
    <div className="flex gap-15 items-center justify-center">
      <IconPerfil is_white_backgroud={false} />
      <div className="bg-orange-dark flex items-center justify-center h-fit p-5">
        <img src={notificationsIcon} alt="Notificações" draggable={false} />
      </div>
    </div>
  );

  return (
    <header
      className={`w-full ${size} flex justify-between items-center bg-white py-12 px-25`}
    >
      <IconFamilySync is_small={imgsize} />
      {children}
    </header>
  );
}

export default DefaultHeader;
