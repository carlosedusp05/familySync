import { useState } from "react";

function DefaultTextField(props) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    // setShowPassword(!showPassword);
    setShowPassword((prev) => !prev);
  };

  const borderColor = props.hasError ? "border-red-500" : "border-orange";

  return (
    <div
      className={`flex px-5  h-14 w-full ${borderColor} border rounded-4xl justify-center items-center text-orange autofill:text-orange  ${props.grid}`}
    >
      <input
        type={props.isPassword && showPassword ? "text" : props.type}
        className="w-full h-full border-none focus:outline-none focus:ring-0 text-[1.1rem] autofill:text-orange autofill:shadow-[0_0_0_30px_white_inset]"
        placeholder={props.placeholder}
        onChange={props.onChange}
        maxLength={props.maxLength}
        value={props.value || ""} // <-- A MÁGICA ACONTECE AQUI
      />
      {props.src && (
        <img
          className="w-10 h-10 font-bold cursor-pointer"
          src={props.src}
          alt={props.alt}
          onClick={props.onClickIcon || togglePasswordVisibility}
        />
      )}
    </div>
  );
}

export default DefaultTextField;
