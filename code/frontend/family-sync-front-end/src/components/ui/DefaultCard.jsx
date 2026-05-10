function DefaultCard({ children, h }) {
  return (
    <div
      className={`bg-white w-[25%]  flex
        rounded-3xl shadow-lg transition-all duration-300 ease-in-out
        px-10 py-15  justify-center
        items-center flex-col gap-7 ${h}`}
    >
      {children}
    </div>
  );
}

export default DefaultCard;
