import { pencilTerracotaIcon } from "../../assets";

function ItemEvents(props) {
  return (
    <div className="w-full flex p-10 rounded-2xl">
      <div className="relative flex justify-end gap-5 items-center">
        <h3 className="absolute bg-terracota text-white pr-4 p-1 text-2xl top-0 left-0 border-tr-2xl font-medium">
          {props.title}
        </h3>
        <img src={pencilTerracotaIcon} alt="PencilIcon" />
        <span className="text-terracota">{props.hours}</span>
        <span className="text-terracota">{props.date}</span>
      </div>
      <p className="w-[90%] text-terracota font-semibold text[15px]">
        {props.desc}
      </p>
      <span className="text-red text-[12px]">{props.creator}</span>
    </div>
  );
}

export default ItemEvents;
