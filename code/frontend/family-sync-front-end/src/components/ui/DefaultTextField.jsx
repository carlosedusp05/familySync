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

  const hideDefaultCalendarIcon =
    props.type === "date"
      ? "[&::-webkit-calendar-picker-indicator]:hidden"
      : "";

  const isProfile = props.variant === "profile";

  const defaultBorderColor = props.hasError
    ? "border-red-500"
    : "border-orange";
  const defaultTextColor = props.hasError ? "text-red-500" : "text-orange";

  const wrapperBaseClasses =
    "flex flex-row w-full justify-between items-center bg-white";
  const wrapperDefaultClasses = `px-5 h-14 rounded-full border ${defaultBorderColor}`;
  const wrapperProfileClasses = "px-4 py-3 rounded-lg shadow-sm";

  const wrapperClasses = `${wrapperBaseClasses} ${isProfile ? wrapperProfileClasses : wrapperDefaultClasses} ${props.grid || ""}`;

  const inputBaseClasses =
    "flex-1 h-full border-none focus:outline-none focus:ring-0 bg-transparent";
  const inputDefaultClasses = `text-[1.1rem] ${defaultTextColor}`;
  const inputProfileClasses =
    "text-xl text-[#4a2511] font-bold placeholder:text-[#4a2511] placeholder:font-bold";

  const inputClasses = `${inputBaseClasses} ${hideDefaultCalendarIcon} ${isProfile ? inputProfileClasses : inputDefaultClasses}`;

  const iconBaseClasses =
    "object-contain cursor-pointer transition-all duration-300 shrink-0";
  const iconDefaultClasses = "w-9 h-9";
  const iconProfileClasses = "w-10 h-10 opacity-90";

  const iconClasses = `${iconBaseClasses} ${isProfile ? iconProfileClasses : iconDefaultClasses}`;

  return (
    <div className={wrapperClasses}>
      <input
        ref={inputRef}
        id={props.id}
        onKeyDown={props.onKeyDown}
        type={props.isPassword && showPassword ? "text" : props.type}
        className={inputClasses}
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
          className={iconClasses}
          src={props.src}
          alt={props.alt || "icon"}
          onClick={handleIconClick}
        />
      )}
    </div>
  );
}

export default DefaultTextField;
