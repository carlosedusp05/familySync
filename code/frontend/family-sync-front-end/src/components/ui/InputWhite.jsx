function InputWhite({ text, styleFlex }) {
  return (
    <div
      className={`${styleFlex} flex items-center justify-center h-22 bg-white shadow-lg rounded-[100px]`}
    >
      <input
        type="text"
        placeholder={text}
        className={`flex-1 text-3xl text-black outline-none px-8 ${
          text === "UF" ? "text-center px-0" : ""
        }`}
      />
    </div>
  );
}

export default InputWhite;
