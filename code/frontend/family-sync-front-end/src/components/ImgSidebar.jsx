function ImgSidebar(props) {
  const background = props.isPage ? "bg-black/15" : "bg-transparent";
  return (
    <div
      className={`${background} w-38 h-38 flex justify-center items-center p-3 rounded-2xl`}
    >
      <img className="h-35 w-35 " src={props.src} alt={props.alt} />
    </div>
  );
}

export default ImgSidebar;
