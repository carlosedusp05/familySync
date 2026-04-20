function ItemNotication(props) {
  return (
    <div className="w-full p-10 relative bg-yellow-cream rounded-[47px]">
      <h2 className="text-orange-dark font-extrabold  text-3xl">
        {props.title}
      </h2>
      <p className="w-full text-orange-dark text-2xl">{props.text}</p>
      <span className="absolute text-orange-dark text-[16px] right-0 bottom-0 py-3 px-10">
        {props.time}
      </span>
    </div>
  );
}

export default ItemNotication;
