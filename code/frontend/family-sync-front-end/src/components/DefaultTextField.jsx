function DefaultTextField(props) {
  return (
    <div className="flex px-1 border-orange border-1 rounded-xl justify-center items-center w-[90%] text-orange">
      <input
        type="text"
        className="w-[90%] h-[100%] outlined-none decoration-none"
        placeholder={props.placeholder}
      />
      {props.src && (
        <img className="w-10 h-10 font-bold" src={props.src} alt={props.alt} />
      )}
    </div>
  );
}

export default DefaultTextField;
