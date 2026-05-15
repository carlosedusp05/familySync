function ItemNotication(props) {
  return (
    <div className="w-[88%] p-10 relative bg-yellow-light rounded-2xl flex flex-col gap-2 transition-all duration-400 hover:scale-104">
      <h2 className="text-terracota font-extrabold  text-2xl">{props.title}</h2>
      <p className="w-full text-orange-dark text-xl font-medium">
        {props.text}
      </p>
      <span className="absolute text-terracota right-0 bottom-0 py-3 px-10">
        {props.time}
      </span>
    </div>
  );
}

export default ItemNotication;
