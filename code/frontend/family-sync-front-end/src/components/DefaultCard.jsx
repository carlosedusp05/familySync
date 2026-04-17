function DefaultCard({ children, slim_card }) {
  const size = slim_card ? "h-[70%] pb-7.5" : "h-[50%] pb-29";

  return (
    <div
      className={`bg-white w-[25%] ${size} flex
        rounded-[20px] shadow-[0_4px_100px_0_rgba(0,0,0,0.25)] 
        px-28 pt-12  justify-center 
        items-center flex-col gap-6`}
    >
      {children}
    </div>
  );
}

export default DefaultCard;
