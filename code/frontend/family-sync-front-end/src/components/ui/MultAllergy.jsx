import ItemAllergy from "./ItemAllergy";

function MultAllergys({ allergys = [], onEditItem, onEditClick }) {
  const truncateText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="flex flex-col items-center gap-4 h-[90%] w-[90%] mx-auto overflow-y-auto pr-3">
      {allergys.map((allergy, index) => (
        <ItemAllergy
          key={allergy.id}
          title={allergy.title}
          desc={truncateText(allergy.desc || "", 80)}
          onClick={() => onEditItem(allergy)}
          onEditClick={() => onEditClick(allergy)}
        />
      ))}
    </div>
  );
}

export default MultAllergys;
