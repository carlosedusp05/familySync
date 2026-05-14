import ItemAllergy from "./ItemAllergy";
import React, { useMemo } from "react";

function MultAllergys({ allergys = [], onEditItem, onEditClick }) {
  const renderedList = useMemo(() => {
    const truncate = (text, limit) =>
      text.length > limit ? text.substring(0, limit) + "..." : text;

    return allergys.map((allergy) => (
      <ItemAllergy
        key={allergy.id}
        title={truncate(allergy.title || "", 60)}
        desc={truncate(allergy.desc || "", 80)}
        onClick={() => onEditItem(allergy)}
        onEditClick={() => onEditClick(allergy)}
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
