import { useState } from "react";
import ItemList from "./ItemList";
import DefaultButton from "../../ui/DefaultButton";
import ItemCreationForm from "./ItemCreationForm";

function MultItemsList({
  items_list = [],
  toggleItem,
  onAddItem,
  onDeleteItem,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [units, setUnits] = useState("1");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Por favor, digite o nome do item.");

    onAddItem({ name, price, units });

    handleCancel();
  };

  const handleCancel = () => {
    setName("");
    setPrice("");
    setUnits("1");
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col gap-2 h-[85%] overflow-y-auto px-2 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md">
      {items_list.map((item) => (
        <ItemList
          key={item.id_item || item.id_map}
          nome_item={item.nome_item}
          price={item.valor_unitario}
          units={item.quantidade}
          isSelected={item.isSelected}
          onToggle={() => toggleItem(item.id_item)}
          onDelete={() => onDeleteItem(item.id_item)}
        />
      ))}

      {isCreating ? (
        <ItemCreationForm
          onAddItem={onAddItem}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="w-full bg-white/15 border-2 border-dashed border-[#D6CFC2]/40 hover:border-orange-dark hover:bg-white/25 flex flex-col items-center justify-center py-5 rounded-[25px] transition-all duration-300 group min-h-25 scale-95 hover:scale-98 active:scale-95 cursor-pointer"
        >
          <span className="text-orange-dark text-6xl font-light leading-none transition-transform group-hover:scale-110">
            +
          </span>
          <span className="text-white/60 group-hover:text-white text-xl font-medium mt-1">
            Adicionar novo item
          </span>
        </button>
      )}
    </div>
  );
}

export default MultItemsList;
