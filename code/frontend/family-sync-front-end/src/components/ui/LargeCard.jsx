function LargeCard({ children, color, not_pop_up }) {
  const style_card = not_pop_up ? "rounded-[50px]" : "rounded-[24px]";

  return (
    <div
      className={`w-[80%] px-7.75 pt-8 pb-6.25 shadow-[0_8px_8px_0_rgba(0,0,0,0.25)] ${style_card} ${color}`}
    >
      {children}
    </div>
  );
}

export default LargeCard;
