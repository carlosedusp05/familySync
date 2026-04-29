function DefaultTextField(props) {
  return (
    <div
      className={`flex px-5  h-14 w-full border-orange border rounded-4xl justify-center items-center text-orange ${props.grid}`}
    >
      <input
        type={props.type}
        className="w-full h-full border-none focus:outline-none focus:ring-0 text-[1.1rem]"
        placeholder={props.placeholder}
      />
      {props.src && (
        <img
          className="w-10 h-10 font-bold cursor-pointer"
          src={props.src}
          alt={props.alt}
          draggable="false"
        />
      )}
    </div>
  );
}

export default DefaultTextField;
