import { pencilTerracotaIcon } from "../../../assets";

function ItemEvents(props) {
  return (
    <div
      className="w-[90%] flex flex-col gap-2 rounded-2xl bg-white-yellow relative
    pb-10 overflow-hidden transition-all duration-400 hover:scale-[1.03]"
    >
      <div className="flex justify-between items-start gap-3">
        <div
          className="bg-terracota py-2 pl-6 pr-4 rounded-tl-2xl
        min-w-0 flex-1 max-w-[50%]"
        >
          <h3
            className="text-white text-[16px] font-medium
          break-words line-clamp-3 w-[90%]"
          >
            {props.title}
          </h3>
        </div>

        <div
          className="flex items-center justify-end gap-6
        shrink-0 pr-4 pt-2"
        >
          <img
            src={pencilTerracotaIcon}
            alt="PencilIcon"
            className="cursor-pointer transition-all duration-400 hover:scale-120"
            onClick={props.onEdit}
          />

          <span className="text-terracota text-[16px] font-medium whitespace-nowrap">
            {props.hours}
          </span>

          <span className="text-terracota text-[16px] font-medium whitespace-nowrap">
            {props.date}
          </span>
        </div>
      </div>

      <p className="w-[90%] pl-10 text-terracota font-bold text-[18px] wrap-break-words">
        {props.desc}
      </p>

      <span className="text-red text-[16px] font-bold absolute right-4 bottom-2">
        Criado por {props.creator}
      </span>
    </div>
  );
}

export default ItemEvents;
