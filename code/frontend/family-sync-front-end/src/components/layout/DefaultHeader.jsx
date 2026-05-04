import IconFamilySync from "../icons/IconFamilySync";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import { notificationsIcon } from "../../assets/index";

function DefaultHeader({ disconnected }) {
  const children = disconnected ? (
    <div className="flex gap-15 ">
      <DefaultButton text="LOGIN" />
      <DefaultButton text="CADASTRAR" />
    </div>
  ) : (
    <div className="flex gap-12 items-center justify-center">
      <IconPerfil is_white_backgroud={false} />
      <div className="bg-orange-dark flex items-center justify-center h-fit p-4 rounded-lg cursor-pointer duration-300 transition-all hover:scale-110">
        <img
          className="w-8 h-8 "
          src={notificationsIcon}
          alt="Notificações"
          draggable={false}
        />
      </div>
    </div>
  );

  return (
    <header
      className={`w-full flex justify-between py-10 items-center bg-white px-16`}
    >
      <IconFamilySync />
      {children}
    </header>
  );
}

export default DefaultHeader;
