import logoutIcon from "../assets/logout.svg";

function DefaultButton({
  theme = true,
  text = "",
  horizontal = "40px",
  vertical = "40px",
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
  const border_radius = most_radius ? "rounded-[40px]" : "rounded-[15px]";

  return (
    <button
      className={`${backgroundColor} ${textColor} ${IsExistBorder} ${border_radius}
        text-[20px] font-bold cursor-pointer
        duration-300 ease-out hover:-translate-y-0.5
        transition-all active:scale-90 active:brightness-90
        shadow-lg flex justify-center content-center items-center gap-3.5`}
      style={{
        paddingBlock: vertical,
        paddingInline: horizontal,
      }}
    >
      {HaveLogout}
      {text}
    </button>
  );
}

export default DefaultButton;
