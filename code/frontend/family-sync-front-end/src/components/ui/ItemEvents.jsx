import { pencilTerracotaIcon } from "../../assets";

function ItemEvents(props) {
  return (
    <div className="w-[98%] flex flex-col gap-2 rounded-2xl bg-white-yellow relative pl-5 pr-8 py-2">
      <div className="px-10 flex absolute top-0 left-0 bg-terracota py-1 rounded-tl-2xl ">
        <h3 className="text-white flex text-[18px] font-medium">
          {props.title}
        </h3>
      </div>
      <div className="flex justify-end gap-5 items-center">
        <img src={pencilTerracotaIcon} alt="PencilIcon" />
        <span className="text-terracota text-[20px] font-medium">
          {props.hours}
        </span>
        <span className="text-terracota text-[20px] font-medium">
          {props.date}
        </span>
      </div>
      <p className="w-[90%] text-terracota font-bold text-[18px] flex-wrap">
        {props.desc}
      </p>
      <span className="text-red text-[16px] font-bold">{props.creator}</span>
    </div>
  );
}

export default ItemEvents;
