import React, { useMemo } from "react";
import ItemAllergy from "./ItemAllergy";
const truncate = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

function MultAllergys({ allergys = [], onEditItem, onEditClick }) {
  const renderedList = useMemo(() => {
    return allergys.map((allergy) => (
      <ItemAllergy
        key={allergy.id}
        item={allergy}
        title={truncate(allergy.title, 60)}
        desc={truncate(allergy.desc, 80)}
        onEditItem={onEditItem}
        onEditClick={onEditClick}
      />
    ));
  }, [allergys, onEditItem, onEditClick]);

  return (
    <div className="flex flex-col items-center gap-4 h-full w-[95%] mx-auto overflow-y-auto pr-3">
      {renderedList}
    </div>
  );
}

export default React.memo(MultAllergys);
