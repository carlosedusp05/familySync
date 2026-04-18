import { logoutIcon } from "../assets";

function DefaultButton({
  theme = true,
  text = "",
  border = false,
  most_radius = false,
  logout_image = false,
}) {
  const backgroundColor = theme ? "bg-orange" : "bg-yellow-cream";
  const textColor = theme ? "text-white" : "text-orange";
  const IsExistBorder = border ? "border border-orange" : "";
  const HaveLogout = logout_image ? (
    <img src={logoutIcon} alt="sair" className="w-12.5 h-15" />
  ) : null;
  const border_radius = most_radius ? "rounded-[50%]" : "rounded-[15px]";
  const minor_text =
    text.length < 4
      ? "text-2xl md:text-[2.5rem] leading-none"
      : "text-base md:text-xl lg:text-[1.2rem]";

  return (
    <button
      className={`${backgroundColor} ${textColor} ${IsExistBorder} ${border_radius} 
        py-2 px-4 
        md:py-3 md:px-8 
        lg:py-4 lg:px-10
        /* Altura controlada */
        h-12 md:h-14 w-full 
        font-bold cursor-pointer
        duration-300 ease-out hover:-translate-y-0.5
        transition-all active:scale-90 active:brightness-90
        shadow-lg flex justify-center content-center items-center gap-3.5 flex-1`}
    >
      {HaveLogout}
      <span className={`flex items-center ${minor_text} justify-center`}>
        {text}
      </span>
    </button>
  );
}

export default DefaultButton;
