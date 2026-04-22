function CardBlackGlass({ children }) {
  return (
    <div className="w-[40%] h-[60%] z-1001 bg-yellow-light rounded-lg shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {children}
    </div>
  );
}

export default CardBlackGlass;
