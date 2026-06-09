import AOS from "aos";
import "aos/dist/aos.css";

function LargeCard({
  children,
  color = "bg-white",
  not_pop_up,
  max_shadow,
  p = "",
  size = "",
  display = "",
  className = "",
  ...rest
}) {
  const style_card = not_pop_up ? "rounded-[30px]" : "rounded-[24px]";

  const shadow = max_shadow
    ? "shadow-[inset_0_10px_100px_0_rgba(0,0,0,0.25)]"
    : "shadow-[0_8px_8px_0_rgba(0,0,0,0.25)]";

  return (
    <div
      // Agora o className externo se junta perfeitamente com as suas props
      className={`${size} ${p} ${display} ${shadow} ${style_card} ${color} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default LargeCard;
