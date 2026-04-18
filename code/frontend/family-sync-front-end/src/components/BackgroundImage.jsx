function BackgroundImage(props) {
  return (
    <div className="-z-1 fixed inset-0 overflow-hidden bg-white">
      <img
        className="w-screen h-screen object-cover blur-sm scale-102"
        src={props.src}
        alt={props.alt}
      />
    </div>
  );
}

export default BackgroundImage;
