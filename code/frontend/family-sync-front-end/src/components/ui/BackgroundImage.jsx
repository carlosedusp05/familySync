function BackgroundImage(props) {
  return (
    <div className="-z-1 fixed inset-0 overflow-hidden bg-white ">
      <img
        className={`w-screen h-screen object-cover ${
          props.blur_or_glass === "blur" ? "blur-[1px]" : ""
        }`}
        src={props.src}
        alt={props.alt}
      />

      {props.blur_or_glass === "glass" && (
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      )}
    </div>
  );
}

export default BackgroundImage;
