function DefaultCard({ children }) {
  return (
    <div
      className={`bg-white w-[25%]  flex
        rounded-[20px] shadow-[0_4px_100px_0_rgba(0,0,0,0.25)] 
        px-20 py-15  justify-center
        items-center flex-col gap-10`}
    >
      {children}
    </div>
  );
}

export default DefaultCard;
