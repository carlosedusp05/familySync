function ImgSidebar(props) {
  const background = props.isPage ? "bg-black/15" : "bg-transparent";
  return (
    <div
      className={`${background} w-full h-28 bg-amber-300 flex justify-center items-center p-8 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-120`}
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
