import React, { useMemo } from "react";
import ItemInfo from "./ItemInfo";

const truncate = (text, limit) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

function MultInfos({ infos = [], onEditItem, onEditClick }) {
  const renderedList = useMemo(() => {
    return infos.map((info) => (
      <ItemInfo
        key={info.id_info}
        item={info}
        title={truncate(info.titulo, 60)}
        desc={truncate(info.descricao, 80)}
        onEditItem={onEditItem}
        onEditClick={onEditClick}
      />
    ));
  }, [infos, onEditItem, onEditClick]);

  return (
    <div className="flex flex-col items-center gap-4 h-full w-[95%] mx-auto overflow-y-auto pr-3">
      {renderedList}
    </div>
  );
}

export default React.memo(MultInfos);
