function ShowAlert({ warning, showWarning }) {
  if (!warning) return null;

  return (
    <div
      className={`
          fixed
          top-5
          left-1/2
          -translate-x-1/2
          bg-red-500
          text-white
          text-center
          px-4
          py-3
          rounded-xl
          shadow-lg
          z-[9999]
          transition-all
          duration-500
  
          ${
            showWarning
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }
        `}
    >
      {warning}
    </div>
  );
}

export default ShowAlert;
