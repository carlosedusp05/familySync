function ItemNotication(props) {
  return (
    <div className="w-full p-4 md:p-6 lg:p-8 relative bg-yellow-light rounded-xl md:rounded-2xl flex flex-col gap-1 transition-all duration-300 hover:scale-[1.02]">
      <h2 className="text-terracota font-extrabold text-lg md:text-xl break-all pr-12">
        {props.title}
      </h2>

      {/* Alterado de break-words para break-all */}
      <p className="w-full text-orange-dark text-sm md:text-base font-medium mb-6 md:mb-5 break-all">
        {props.text}
      </p>

      <span className="absolute text-terracota right-0 bottom-0 py-3 px-4 md:px-6 text-xs md:text-sm font-semibold">
        {props.time}
      </span>
    </div>
  );
}
export default ItemNotication;
