function OrangeButton(props) {
  return (
    <button
      className="bg-[#FF8133] text-white w-45 h-14 rounded-[15px]
        text-[20px] font-bold cursor-pointer
        duration-300 
        ease-out
        hover:-translate-y-0.5
        transition-all 
        active:scale-90 
        active:brightness-90
        shadow-lg"
    >
      {props.text}
    </button>
  );
}

export default OrangeButton;
