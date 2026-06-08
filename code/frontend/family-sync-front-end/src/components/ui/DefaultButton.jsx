import { logoutIcon } from "../../assets";
import { logoutIconRed } from "../../assets";

function DefaultButton({
  theme = true,
  text = "",
  type = "button",
  border = false,
  most_radius = false,
  logout_image = false,
  another_size,
  another_text_size,
  another_text_weight,
  another_text_color,
  another_color,
  onClick,
  onMouseEnter,
  another_padding,
  logout_red = false,
  disabled = false,
  ...rest
}) {
  const backgroundColor =
    another_color || (theme ? "bg-orange" : "bg-yellow-cream");
  const textColor =
    another_text_color || (theme ? "text-white" : "text-orange");
  const IsExistBorder = border ? "border border-orange" : "";
  const HaveLogout = logout_image ? (
    logout_red ? (
      <img
        src={logoutIconRed}
        alt="sair"
        className="w-6 h-6 md:h-8 md:w-8 object-contain"
      />
    ) : (
      <img
        src={logoutIcon}
        alt="sair"
        className="w-6 h-6 md:h-8 md:w-8 object-contain"
      />
    )
  ) : null;
  const border_radius = most_radius ? "rounded-[50%]" : "rounded-[15px]";
  const size = another_size
    ? another_size
    : "h-9 md:h-12 w-full max-sm-90 flex-1";
  const textSize = another_text_size
    ? another_text_size
    : "text-[12px] sm:text-sm md:text-base";
  const textStyle = another_text_weight ? another_text_weight : "font-bold";
  const padding = another_padding
    ? another_padding
    : "py-2 px-3 sm:px-5 md:py-3 md:px-6 lg:px-8";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${backgroundColor} ${textColor} ${IsExistBorder} ${border_radius} 
        ${size} ${textStyle} ${padding}
        cursor-pointer
        transition-transform duration-300 ease-out
        hover:-translate-y-0.5 active:scale-90 active:brightness-90
        translate-z-0 perspective-1000 select-none
        shadow-lg flex justify-center content-center items-center gap-3.5 `}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      {...rest}
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
