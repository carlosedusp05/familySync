function BackgroundImage(props) {
  return (
    <div className="absolute -z-1 left-0 top-0">
      <img
        className="w-screen h-screen object-cover blur-lg"
        src={props.src}
        alt={props.alt}
      />
    </div>
  );
}

export default BackgroundImage;
