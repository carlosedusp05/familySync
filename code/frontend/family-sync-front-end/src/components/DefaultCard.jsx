function DefaultCard({ children, slim_card }) {
  const size = slim_card ? "h-249.25 pb-7.5" : "h-194.5 pb-29";

  return (
    <div
      className={`w-174.25 ${size}
        rounded-[20px] shadow-[0_4px_100px_0_rgba(0,0,0,0.25)] 
        px-28 pt-12 flex justify-center 
        items-center flex-col gap-6`}
    >
      {children}
    </div>
  );
}

export default DefaultCard;
