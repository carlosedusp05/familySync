function DefaultButton(props) {
  return (
    <button
      className="bg-[#FF8133] text-white rounded-[15px]
        text-[20px] font-bold cursor-pointer
        duration-300 ease-out hover:-translate-y-0.5
        transition-all active:scale-90 active:brightness-90
        shadow-lg"
      style={{ 
      paddingBlock: props.vertical, 
      paddingInline: props.horizontal 
    }}
    >
      {props.text}
    </button>
  );
}

export default DefaultButton;
