function ImgSidebar(props) {
  return (
    <div
      className={`w-full h-22 flex justify-center items-center p-8 xl:p-4 2xl:p-8 rounded-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 xl:h-18 2xl:h-28
        max-lg:w-full max-lg:h-full max-lg:p-0 max-lg:pointer-events-none max-lg:hover:scale-100
      `}
    >
      <img
        className={`w-full max-lg:w-10 max-lg:h-10 max-lg:object-contain xl:h-12 xl:w-12 2xl:h-15 2xl:w-15 object-contain transition-colors duration-300
        ${
          props.isPage
            ? "max-lg:[filter:brightness(0)_saturate(100%)_invert(55%)_sepia(80%)_saturate(1500%)_hue-rotate(345deg)_brightness(100%)_contrast(95%)]"
            : ""
        }`}
        src={props.src}
        alt={props.alt}
        draggable={false}
      />
    </div>
  );
}

export default ImgSidebar;
