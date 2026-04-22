function LargeCard({ children, color, not_pop_up, p, size }) {
  const style_card = not_pop_up ? "rounded-[50px]" : "rounded-[24px]";

  return (
    <div
      className={`${size} ${p}  shadow-[0_8px_8px_0_rgba(0,0,0,0.25)] ${style_card} ${color}`}
    >
      {children}
    </div>
  );
}

export default LargeCard;
