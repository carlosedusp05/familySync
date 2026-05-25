function InputWhite({ text, styleFlex, name, value, onChange, disabled }) {
  return (
    <div
      className={`${styleFlex} flex items-center justify-center h-12 rounded-2xl shadow border transition-colors ${
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
        className={`flex-1 text-[18px] outline-none bg-transparent px-8 w-full ${
          text === "UF" || text === "CEP" ? "text-center px-0" : ""
        } ${disabled ? "text-gray-500 cursor-default" : "text-black"}`}
      />
    </div>
  );
}

export default InputWhite;
