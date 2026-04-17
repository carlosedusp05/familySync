function CardNotication(props) {
  return (
    <div className="w-full p-10 relative">
      <h2 className="text-orange font-bold">{props.title}</h2>
      <p className="w-100 text-orange">{props.text}</p>
      <span className="absolute right-0 bottom-0 p-2"></span>
    </div>
  );
}

export default CardNotication;
