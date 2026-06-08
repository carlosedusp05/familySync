function ShowAlert({ warning, showWarning }) {
  if (!warning) return null;

  return (
    <div
      className={`
        fixed                 
        top-4
        left-1/2
        -translate-x-1/2
        w-[90%]
        sm:w-max
        max-w-md md:max-w-xl
        text-sm md:text-base
        bg-red-500
        text-white
        text-center
        px-5
        py-3
        rounded-xl
        shadow-lg
        z-[9999]
        transition-all
        duration-500
        break-words
        ${
          showWarning
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }
      `}
    >
      <p className="font-medium">{warning}</p>
    </div>
  );
}

export default ShowAlert;
