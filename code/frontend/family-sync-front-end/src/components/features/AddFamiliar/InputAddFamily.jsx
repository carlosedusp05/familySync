function InputAddFamily({ w, type, placeholder, error, ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${w}`}>
      <input
        {...props}
        type={type}
        placeholder={placeholder}
        className={`flex p-2 md:p-3 text-sm md:text-[18px] lg:text-[20px] border md:border-2 rounded-2xl md:rounded-4xl px-4 md:px-6 w-full text-black focus:outline-none focus:ring-0 bg-white transition-colors ${
          error ? "border-red-500" : "border-orange-dark"
        }`}
      />
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          error ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <span className="text-red-500 text-xs md:text-sm px-2 md:px-4 block">
          {error}
        </span>
      </div>
    </div>
  );
}

export default InputAddFamily;
