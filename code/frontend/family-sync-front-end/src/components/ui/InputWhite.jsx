function InputWhite({ text, styleFlex, name, value, onChange, disabled }) {
  return (
    <div
      className={`${styleFlex} flex items-center justify-center h-12 rounded-xl sm:rounded-2xl shadow border transition-colors w-full ${
        disabled
          ? "bg-gray-50 border-gray-200 opacity-80"
          : "bg-white border-white"
      }`}
    >
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={text}
        className={`flex-1 text-base sm:text-[18px] outline-none bg-transparent px-4 sm:px-8 w-full ${
          text === "UF" || text === "CEP" ? "text-center sm:px-0" : ""
        } ${disabled ? "text-gray-500 cursor-default" : "text-black"}`}
      />
    </div>
  );
}

export default InputWhite;
