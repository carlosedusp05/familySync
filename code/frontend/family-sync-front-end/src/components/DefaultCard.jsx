function DefaultCard({ children }) {
  return (
    <div
      className="w-174.25 h-194.5 
        rounded-[20px] shadow-[0_4px_100px_0_rgba(0,0,0,0.25)] 
        px-28 pt-12 pb-29 flex justify-center 
        items-center flex-col gap-6"
    >
      {children}
    </div>
  );
}

export default DefaultCard;
