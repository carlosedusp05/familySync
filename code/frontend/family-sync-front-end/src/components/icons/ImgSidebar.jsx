function ImgSidebar(props) {
  const background = props.isPage ? "bg-black/15" : "bg-transparent";
  return (
    <div
      className={`${background} w-full h-28 bg-amber-300 flex justify-center items-center p-8 rounded-2xl`}
    >
      <img
        className="h-18 w-18"
        src={props.src}
        alt={props.alt}
        draggable={false}
      />
    </div>
  );
}

export default ImgSidebar;
