function ImgSidebar(props) {
  return (
    <div
      className={` w-full h-22 flex justify-center items-center p-8 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-105
        xl:h-28
        max-md:h-2 max-md:py-10 max-md:px-4
        `}
    >
      <img
        className=" w-full"
        src={props.src}
        alt={props.alt}
        draggable={false}
      />
    </div>
  );
}

export default ImgSidebar;
