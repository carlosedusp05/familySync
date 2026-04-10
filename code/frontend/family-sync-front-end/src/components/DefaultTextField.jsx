function DefaultTextField(props) {
  return (
    <div className="flex px-5 h-10 w-full border-orange border rounded-2xl justify-center items-center  text-orange">
      <input
        type={props.type}
        className="w-full h-full border-none focus:outline-none focus:ring-0"
        placeholder={props.placeholder}
      />
      {props.src && (
        <img className="w-10 h-10 font-bold" src={props.src} alt={props.alt} />
      )}
    </div>
  );
}

export default DefaultTextField;
