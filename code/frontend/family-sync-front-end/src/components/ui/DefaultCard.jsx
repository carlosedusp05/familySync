function DefaultCard({ children, h }) {
  return (
    <div
      className={`bg-white   flex
        rounded-3xl shadow-lg transition-all duration-300 ease-in-out

        w-[92%]
      sm:w-[80%]
      md:w-[60%]
      lg:w-[40%]
      xl:w-[25%]

      px-6 sm:px-8 md:px-10
      py-8 sm:py-10 md:py-15 

      gap-5 md:gap-7 max-sm:5

      justify-center
      items-center flex-col  ${h}`}
    >
      {children}
    </div>
  );
}

export default DefaultCard;
