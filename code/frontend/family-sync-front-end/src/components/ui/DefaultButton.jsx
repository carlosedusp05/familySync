import { logoutIcon } from "../../assets";

function DefaultButton({
  theme = true,
  text = "",
  border = false,
  most_radius = false,
  logout_image = false,
  another_size,
  another_text_size,
  another_text_weight,
  another_color,
  onClick,
  another_padding,
}) {
  const backgroundColor =
    another_color || (theme ? "bg-orange" : "bg-yellow-cream");

  const textColor = theme ? "text-white" : "text-orange";
  const IsExistBorder = border ? "border border-orange" : "";
  const HaveLogout = logout_image ? (
    <img src={logoutIcon} alt="sair" className="w-12.5 h-15" />
  ) : null;
  const border_radius = most_radius ? "rounded-[50%]" : "rounded-[15px]";
  const size = another_size ? another_size : "h-12 md:h-14 w-full flex-1";
  const textSize = another_text_size
    ? another_text_size
    : "text-sm sm:text-base";
  const textStyle = another_text_weight ? another_text_weight : "font-bold";
  const padding = another_padding
    ? another_padding
    : "py-2 px-2 sm:px-4 md:py-3 md:px-8 lg:py-4 lg:px-10";

  return (
    <button
      className={`${backgroundColor} ${textColor} ${IsExistBorder} ${border_radius} 
        ${size} ${textStyle} ${padding}
        cursor-pointer
        duration-300 ease-out hover:-translate-y-0.5
        transition-all active:scale-90 active:brightness-90
        shadow-lg flex justify-center content-center items-center gap-3.5`}
      onClick={onClick}
    >
      {HaveLogout}
      <span
        className={`flex items-center ${textSize} justify-center whitespace-nowrap`}
      >
        {text}
      </span>
    </button>
  );
}

export default DefaultButton;
