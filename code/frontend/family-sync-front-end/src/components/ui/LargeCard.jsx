function LargeCard({
  children,
  color,
  not_pop_up,
  max_shadow,
  p,
  size,
  display,
}) {
  const style_card = not_pop_up ? "rounded-[50px]" : "rounded-[24px]";
  const shadow = max_shadow
    ? "shadow-[inset_0_10px_100px_0_rgba(0,0,0,0.25)]"
    : "shadow-[0_8px_8px_0_rgba(0,0,0,0.25)]";

  return (
    <div
      className={`${size} ${p} ${display} shadow-[0_8px_8px_0_rgba(0,0,0,0.25)] ${shadow} ${style_card} ${color}`}
    >
      {children}
    </div>
  );
}

export default LargeCard;
