import { pencilTerracotaIcon } from "../../../assets";

function ItemEvents(props) {
  return (
    <div
      className="w-full flex flex-col justify-between rounded-2xl bg-[#FFFDF9] shadow-md relative
      pb-8 pt-0 overflow-hidden transition-all duration-300 hover:scale-[1.01]
      min-h-[80px] sm:min-h-[130px]"
    >
      <div>
        <div className="flex justify-between items-center w-full gap-2">
          <div className="bg-terracota py-1.5 sm:py-2 px-4 sm:px-6 rounded-tl-2xl rounded-br-2xl sm:rounded-br-none max-w-[50%] sm:max-w-[60%] shrink-0 shadow-sm">
            <h3 className="text-white text-[12px] sm:text-[15px] md:text-[16px] font-bold break-words line-clamp-1">
              {props.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 pr-3 sm:pr-4 text-[11px] xl:text-[16px] sm:text-xs md:text-sm font-semibold text-terracota shrink-0">
            <img
              src={pencilTerracotaIcon}
              alt="Editar"
              className="cursor-pointer transition-transform duration-200 hover:scale-120 w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7 md:hover:scale-110"
              onClick={props.onEdit}
            />
            <span className="whitespace-nowrap">{props.hours}</span>
            <span className="whitespace-nowrap">{props.date}</span>
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-2 sm:pt-3 pb-2">
          <p className="text-terracota/90 font-medium text-[12px] sm:text-[14px] md:text-[15px] lg:text-[18px] break-words leading-relaxed line-clamp-2 sm:line-clamp-none">
            {props.desc}
          </p>
        </div>
      </div>

      {/* Rodapé de Criação */}
      <span className="text-red-500 text-[10px] sm:text-[11px] md:text-[12px] xl:text-[16px] font-bold absolute right-3 bottom-1.5 bg-[#FFFDF9]/90 pl-1">
        Criado por {props.creator}
      </span>
    </div>
  );
}

export default ItemEvents;
