import ItemList from "./ItemList";

function MultItemsList({ items_list = [], selectedItems, toggleItem }) {
  return (
    <div
      className="flex flex-col gap-2 h-full overflow-y-auto px-2 [&::-webkit-scrollbar]:w-3
    [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-[#282828]
    [&::-webkit-scrollbar-thumb]:rounded-md"
    >
      {items_list.map((item, index) => (
        <ItemList
          key={index}
          name={item.name}
          price={item.price}
          units={item.units}
          isSelected={selectedItems.includes(index)}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}

export default MultItemsList;
