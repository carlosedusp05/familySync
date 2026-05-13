function InputWhite({ text, styleFlex }) {
  return (
    <div
      className={`${styleFlex} flex items-center justify-center h-17 bg-white rounded-2xl`}
    >
      <input
        type="text"
        placeholder={text}
        className={`flex-1 text-[22px] text-black outline-none px-8 ${
          text === "UF" ? "text-center px-0" : ""
        }`}
      />
    </div>
  );
}

export default InputWhite;
