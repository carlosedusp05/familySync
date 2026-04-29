import { pencilTerracotaIcon } from "../../assets";

function ItemAllergy(props) {
  return (
    <div className="w-[98%] flex flex-col gap-2 rounded-2xl bg-white-yellow relative p-8 pt-5 py-2">
      <div className="px-10 flex absolute top-5 left-0  py-1 rounded-tl-2xl ">
        <h3 className="text-orange flex text-3xl font-medium">{props.title}</h3>
      </div>
      <div className="flex justify-end gap-5 items-center">
        <img
          src={pencilTerracotaIcon}
          alt="PencilIcon"
          className="duration-300 ease-out
        transition-all active:scale-90 active:brightness-90"
          draggable={false}
        />
      </div>
      <p className="w-[90%] text-terracota font-bold text-[18px] flex-wrap">
        {props.desc}
      </p>
      <span className="text-red text-[16px] font-bold">{props.creator}</span>
    </div>
  );
}

export default ItemAllergy;
