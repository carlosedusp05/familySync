function InputWhite({ text, styleFlex }) {
  return (
    <div
      className={`${styleFlex} flex items-center justify-center h-12 bg-white rounded-2xl shadow border border-white`}
    >
      <input
        type="text"
        placeholder={text}
        className={`flex-1 text-[18px] text-black outline-none px-8 ${
          text === "UF" ? "text-center px-0" : ""
        }`}
      />
    </div>
  );
}

export default InputWhite;
