import { useState, useEffect } from "react";
import DefaultButton from "../../ui/DefaultButton";

function ModalList({ isOpen, onClose, onSave, data, isEdit }) {
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemUnits, setNewItemUnits] = useState(1);
  const [isPurchaseList, setIsPurchaseList] = useState(true);

  useEffect(() => {
    if (data && isEdit) {
      setListName(data.name || "");
      setItems(data.items || []);
    } else {
      setListName("");
      setItems([]);
    }
    setNewItemName("");
    setNewItemPrice("");
    setNewItemUnits(1);
    setIsPurchaseList(true);
  }, [data, isEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddLocalItem = () => {
    if (!newItemName.trim()) return;

    const priceParsed =
      parseFloat(newItemPrice.toString().replace(",", ".")) || 0;
    const unitsParsed = parseInt(newItemUnits, 10) || 1;

    const newItem = {
      id: Date.now(),
      name: newItemName,
      price: priceParsed,
      units: unitsParsed,
      isSelected: false,
    };

    setItems((prev) => [...prev, newItem]);

    setNewItemName("");
    setNewItemPrice("");
    setNewItemUnits(1);
  };

  const handleRemoveLocalItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSave = () => {
    if (!listName.trim()) return;
    onSave({ name: listName, items: items });
  };

  const totalPurchase = items.reduce(
    (acc, item) => acc + item.price * item.units,
    0,
  );

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all p-4">
      <div className="bg-[#FDF6E3] max-w-4xl w-full rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 border border-white/40 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#E65C00]/10 pb-3">
          <h2 className="text-4xl font-bold text-[#E65C00] tracking-tight">
            {isEdit ? "Editar Lista" : "Criar Nova Lista"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#E65C00]/60 hover:text-[#E65C00] transition-colors text-2xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#E65C00] font-bold text-xl tracking-wider px-1">
              Tema da lista
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Ex: Compras do Mês, Feira, Viagem..."
              className="w-full bg-white rounded-2xl h-14 px-4 text-xl indent-2 text-[#5C2B10] placeholder:text-gray-400 font-medium outline-none border border-[#FDBA74] focus:border-[#E65C00] focus:ring-2 focus:ring-[#E65C00]/20 transition-all shadow-sm"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#E65C00] font-bold text-xl tracking-wider px-1">
              Adicionar itens à lista
            </label>

            <div className="flex flex-col lg:flex-row gap-3 items-stretch">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLocalItem()}
                placeholder="Nome do item..."
                className="flex-1 bg-white rounded-2xl h-14 px-4 text-xl indent-2 text-[#5C2B10] placeholder:text-gray-400 font-medium outline-none border border-[#FDBA74] focus:border-[#E65C00] focus:ring-2 focus:ring-[#E65C00]/20 transition-all shadow-sm"
              />

              <div className="flex items-center gap-2  rounded-xl h-12 px-3 shadow-md">
                <div
                  onClick={() => setIsPurchaseList(!isPurchaseList)}
                  title="Ativar/Desativar modo de compras"
                  className="w-8 h-8 rounded-full border-2 border-orange flex items-center justify-center cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  {isPurchaseList && (
                    <div className="w-4 h-4 bg-orange rounded-full animate-fade-in" />
                  )}
                </div>

                <div className="flex items-center bg-white rounded-lg px-2 h-8 w-50 shadow-inner">
                  <span className="text-xl text-[#E65C00]/70 font-bold mr-1">
                    R$
                  </span>
                  <input
                    type="text"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="0,00"
                    disabled={!isPurchaseList}
                    className="w-full bg-transparent text-center text-xl text-[#E65C00]  px-2  font-bold outline-none disabled:opacity-40"
                  />
                </div>

                <input
                  type="number"
                  value={newItemUnits}
                  onChange={(e) => setNewItemUnits(e.target.value)}
                  placeholder="1"
                  min="1"
                  disabled={!isPurchaseList}
                  className="w-12 h-8 bg-white rounded-lg text-center text-xl text-[#E65C00] font-bold outline-none shadow-inner disabled:opacity-40"
                />
              </div>
              <DefaultButton
                onClick={handleAddLocalItem}
                text="+"
                another_size={"h-12 w-12"}
                another_text_size={"text-3xl"}
                another_color={"bg-brown-dark"}
              />
            </div>
          </div>

          <div className="border border-orange/70 rounded-xl p-3 h-70 overflow-y-auto bg-white/40 shadow-inner [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-orange-dark/70 font-medium gap-1 text-center p-4 ">
                <span className="text-5xl">🛒</span>
                <p className="text-xl">Nenhum item adicionado à lista ainda.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FF8B40] text-white rounded-xl flex items-center justify-between px-8 py-2.5 shadow-sm transition-all hover:translate-y-[-1px]"
                  >
                    <span className="flex-1 font-semibold truncate pr-3 text-xl">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-white/80 font-medium text-xl">
                        R$ {formatCurrency(item.price)} × {item.units}
                      </span>
                      <div className="bg-white text-[#E65C00] font-bold px-2.5 py-1 rounded-lg text-xl shadow-inner min-w-[80px] text-right">
                        R$ {formatCurrency(item.price * item.units)}
                      </div>
                      <button
                        onClick={() => handleRemoveLocalItem(item.id)}
                        className="bg-[#C24100]/20 hover:bg-red-600 hover:text-white transition-colors text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-[#E65C00]/10">
            <div>
              {isPurchaseList && (
                <h3 className="text-[#E65C00] font-extrabold text-xl flex items-center">
                  Total da compra:{" "}
                  <span className="text-[#5C2B10] bg-white text-xl px-3 py-1 rounded-lg border border-[#FDBA74] ml-1 shadow-sm ">
                    R$ {formatCurrency(totalPurchase)}
                  </span>
                </h3>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <DefaultButton
                onClick={onClose}
                text="Cancelar"
                theme={false}
                another_padding={"px-15 py-2.5"}
                another_text_size={"text-xl font-semibold"}
              />
              <DefaultButton
                onClick={handleSave}
                text={isEdit ? "Salvar Alterações" : "Criar Lista"}
                another_padding={"px-15 py-2.5"}
                another_text_size={"text-xl font-semibold"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalList;
