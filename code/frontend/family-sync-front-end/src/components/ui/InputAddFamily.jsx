function InputAddFamily({ w, type, placeholder, error, ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${w}`}>
      <input
        {...props}
        type={type}
        placeholder={placeholder}
        className={`flex p-3 text-[20px] border-2 rounded-4xl px-6 w-full text-black focus:outline-none focus:ring-0 bg-white transition-colors ${
          error ? "border-red-500" : "border-orange"
        }`}
      />
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          error ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <span className="text-red-500 text-sm px-4 block">{error}</span>
      </div>
    </div>
  );
}

export default InputAddFamily;
