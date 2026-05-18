import { useState, useEffect } from "react";
import DefaultButton from "../../ui/DefaultButton";
import { formatMoneyMask, parseMoneyToFloat } from "../../../utils/formatters";

function ModalList({ isOpen, onClose, onSave, data, isEdit }) {
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemUnits, setNewItemUnits] = useState(1);
  const [isPurchaseList, setIsPurchaseList] = useState(true);
  const [errors, setErrors] = useState({
    tema_nome: false,
    item_nome: false,
    valor: false,
  });

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
    setErrors({ tema_nome: false, item_nome: false, valor: false });
  }, [data, isEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddLocalItem = () => {
    const priceParsed = parseMoneyToFloat(newItemPrice);
    const unitsParsed = parseInt(newItemUnits, 10) || 1;

    const temErroNome = !newItemName.trim();
    const temErroPreco = isPurchaseList && priceParsed <= 0;

    if (temErroNome || temErroPreco) {
      setErrors((prev) => ({
        ...prev,
        item_nome: temErroNome,
        valor: temErroPreco,
      }));
      return;
    }

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
    setErrors((prev) => ({ ...prev, item_nome: false, valor: false }));
  };

  const handleRemoveLocalItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSave = () => {
    if (!listName.trim()) {
      setErrors((prev) => ({ ...prev, tema_nome: true }));
      return;
    }

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

  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    setNewItemPrice(formatMoneyMask(rawValue));

    if (errors.valor) {
      setErrors((prev) => ({ ...prev, valor: false }));
    }
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
              onChange={(e) => {
                setListName(e.target.value);
                if (errors.tema_nome)
                  setErrors((prev) => ({ ...prev, tema_nome: false }));
              }}
              placeholder="Ex: Compras do Mês, Feira, Viagem..."
              maxLength={50}
              className={`w-full bg-white rounded-2xl h-14 px-4 text-xl indent-2 text-[#5C2B10] placeholder:text-gray-400 font-medium outline-none border transition-all shadow-sm focus:ring-2 ${
                errors.tema_nome
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[#FDBA74] focus:border-[#E65C00] focus:ring-[#E65C00]/20"
              }`}
              autoFocus
            />
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${
                errors.tema_nome
                  ? "max-h-12 opacity-100 mt-1"
                  : "max-h-0 opacity-0"
              }`}
            >
              <span className="text-red-500 text-sm px-2 block font-medium">
                Qual é o tema da lista? Escreva aqui em cima.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#E65C00] font-bold text-xl tracking-wider px-1">
              Adicionar itens à lista
            </label>
            <div className="flex flex-col lg:flex-row gap-3 items-start w-full">
              <div className="flex-1 w-full flex flex-col">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => {
                    setNewItemName(e.target.value);
                    if (errors.item_nome)
                      setErrors((prev) => ({ ...prev, item_nome: false }));
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAddLocalItem()}
                  placeholder="Nome do item..."
                  maxLength={100}
                  className={`w-full bg-white rounded-2xl h-14 px-4 text-xl indent-2 text-[#5C2B10] placeholder:text-gray-400 font-medium outline-none border transition-all shadow-sm focus:ring-2 ${
                    errors.item_nome
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-[#FDBA74] focus:border-[#E65C00] focus:ring-[#E65C00]/20"
                  }`}
                />
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${
                    errors.item_nome
                      ? "max-h-12 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <span className="text-red-500 text-sm px-2 block font-medium">
                    Qual é o nome do item? Escreva aqui em cima.
                  </span>
                </div>
              </div>
              <div className="flex flex-col w-full lg:w-auto">
                <div className="flex items-center gap-2 rounded-xl h-14 px-3 shadow-md bg-white/50">
                  <div
                    onClick={() => setIsPurchaseList(!isPurchaseList)}
                    title="Ativar/Desativar modo de compras"
                    className="w-8 h-8 rounded-full border-2 border-orange flex items-center justify-center cursor-pointer transition-transform active:scale-95 shrink-0"
                  >
                    {isPurchaseList && (
                      <div className="w-4 h-4 bg-orange rounded-full animate-fade-in" />
                    )}
                  </div>

                  <div
                    className={`flex items-center bg-white rounded-lg px-2 h-8 w-50 shadow-inner border ${
                      errors.valor ? "border-red-500" : "border-transparent"
                    }`}
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      value={newItemPrice}
                      onChange={handlePriceChange}
                      maxLength={16}
                      placeholder="R$0,00"
                      disabled={!isPurchaseList}
                      className="w-full bg-transparent text-center text-xl text-[#E65C00] px-2 font-bold outline-none disabled:opacity-40"
                    />
                  </div>

                  <input
                    type="number"
                    value={newItemUnits}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 3) {
                        setNewItemUnits(value);
                      }
                    }}
                    placeholder="1"
                    min="1"
                    max="999"
                    disabled={!isPurchaseList}
                    className="w-20 h-8 bg-white rounded-lg text-center text-xl text-[#E65C00] font-bold outline-none shadow-inner disabled:opacity-40"
                  />
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${
                    errors.valor
                      ? "max-h-12 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <span className="text-red-500 text-sm px-2 block font-medium">
                    Você esqueceu de informar o preço deste item.
                  </span>
                </div>
              </div>
              <div className="h-14 flex items-center justify-center self-start lg:self-auto">
                <DefaultButton
                  onClick={handleAddLocalItem}
                  text="+"
                  another_size={"h-12 w-12"}
                  another_text_size={"text-3xl"}
                  another_color={"bg-brown-dark"}
                />
              </div>
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
                    className="bg-[#FF8B40] text-white rounded-xl flex items-center justify-between px-8 py-2.5 shadow-sm transition-all hover:-translate-y-px"
                  >
                    <span className="flex-1 font-semibold truncate pr-3 text-xl">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-white/80 font-medium text-xl">
                        R$ {formatCurrency(item.price)} × {item.units}
                      </span>
                      <div className="bg-white text-[#E65C00] font-bold px-2.5 py-1 rounded-lg text-xl shadow-inner min-w-20 text-right">
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
                  Total da compra:
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
