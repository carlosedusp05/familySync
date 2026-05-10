import { useState, useRef } from "react";

function DefaultTextField(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const inputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleIconClick = () => {
    if (props.onClickIcon) {
      props.onClickIcon();
    } else if (props.isPassword) {
      togglePasswordVisibility();
    } else if (props.type === "date" && inputRef.current) {
      if (isCalendarOpen) {
        inputRef.current.blur();
        setIsCalendarOpen(false);
      } else {
        try {
          inputRef.current.showPicker();
          setIsCalendarOpen(true);
        } catch (error) {
          inputRef.current.focus();
          setIsCalendarOpen(true);
        }
      }
    }
  };

  const handleBlur = (e) => {
    if (props.type === "date") {
      setIsCalendarOpen(false);
      if (props.min && e.target.value && e.target.value < props.min) {
        const parts = e.target.value.split("-");
        const minYear = props.min.split("-")[0];

        if (parts[0] < minYear) {
          e.target.value = `${minYear}-${parts[1] || "01"}-${parts[2] || "01"}`;
          if (props.onChange) props.onChange(e);
        }
      }
    }
    if (props.onBlur) props.onBlur(e);
  };

  const borderColor = props.hasError ? "border-red-500" : "border-orange";

  const hideDefaultCalendarIcon =
    props.type === "date"
      ? "[&::-webkit-calendar-picker-indicator]:hidden"
      : "";

  return (
    <div
      className={`flex flex-row px-5 h-14 w-full ${borderColor} border rounded-full justify-between items-center text-orange bg-white ${props.grid || ""}`}
    >
      <input
        ref={inputRef}
        id={props.id}
        onKeyDown={props.onKeyDown}
        type={props.isPassword && showPassword ? "text" : props.type}
        className={`flex-1 h-full border-none focus:outline-none focus:ring-0 bg-transparent text-[1.1rem] ${hideDefaultCalendarIcon}`}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={handleBlur}
        maxLength={props.maxLength}
        value={props.value || ""}
        max={props.max}
        min={props.min}
      />

      {props.src && (
        <img
          onMouseDown={(e) => {
            if (props.type === "date") e.preventDefault();
          }}
          className={`w- h-9 object-contain cursor-pointer transition-all duration-300 shrink-0`}
          src={props.src}
          alt={props.alt || "icon"}
          onClick={handleIconClick}
        />
      )}
    </div>
  );
}

export default DefaultTextField;
