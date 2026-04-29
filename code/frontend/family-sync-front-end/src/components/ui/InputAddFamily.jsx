function InputAddFamily(props) {
  return (
    <input
      className={`flex p-3 text-[20px] border-orange border-2 rounded-4xl pl-4 ${props.w} text-black  focus:outline-none focus:ring-0 bg-white`}
      type={props.type}
      placeholder={props.placeholder}
    />
  );
}

export default InputAddFamily;
