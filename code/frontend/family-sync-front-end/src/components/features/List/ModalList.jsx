import { useState, useEffect } from "react";
import DefaultButton from "../../ui/DefaultButton";
import { formatMoneyMask, parseMoneyToFloat } from "../../../utils/formatters";

function ModalList({
  isOpen,
  onClose,
  onSave,
  onSaveEdit,
  data,
  isEdit,
  onDeleteItem,
}) {
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
  const [itemsDeleted, setItemsDeleted] = useState([]);
  const [itemsCreated, setItemsCreated] = useState([]);

  useEffect(() => {
    if (data && isEdit) {
      setListName(data.nome || "");
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
      id_map: Date.now(),
      nome_item: newItemName,
      valor_unitario: priceParsed,
      quantidade: unitsParsed,
      isSelected: false,
    };

    setItems((prev) => [...prev, newItem]);
    setItemsCreated((prev) => [...prev, newItem]);

    setNewItemName("");
    setNewItemPrice("");
    setNewItemUnits(1);
    setErrors((prev) => ({ ...prev, item_nome: false, valor: false }));
  };

  const handleRemoveLocalItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id_item !== itemId));
    setItemsDeleted((prev) => [...prev, itemId]);
  };

  const handleSave = () => {
    if (!listName.trim()) {
      setErrors((prev) => ({ ...prev, tema_nome: true }));
      return;
    }
    onSave({ nome: listName, items });
  };

  const handleSaveEditions = () => {
    if (!listName.trim()) {
      setErrors((prev) => ({ ...prev, tema_nome: true }));
      return;
    }

    if (
      itemsCreated.length === 0 &&
      itemsDeleted.length === 0 &&
      listName === data.nome
    ) {
      return onClose();
    }

    const payload = {};

    if (listName !== data.nome) {
      payload.nome = listName;
    }

    if (itemsCreated.length > 0) {
      payload.items = itemsCreated;
    }

    onSaveEdit(payload);

    itemsDeleted.forEach((id) => {
      onDeleteItem(id);
    });
  };

  const totalPurchase = items.reduce(
    (acc, item) => acc + item.valor_unitario * item.quantidade,
    0,
  );

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "0,00";
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
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-all p-4 pt-23 sm:pt-4">
      <div className="bg-[#FDF6E3] max-w-4xl w-full rounded-2xl p-5 md:p-8 shadow-2xl flex flex-col gap-4 md:gap-6 border border-white/40 max-h-[68vh] md:max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
        <div className="flex justify-between items-center border-b border-[#E65C00]/10 pb-3">
          <h2 className="text-2xl md:text-4xl font-bold text-[#E65C00] tracking-tight">
            {isEdit ? "Editar Lista" : "Criar Nova Lista"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#E65C00]/60 hover:text-[#E65C00] transition-colors text-2xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#E65C00] font-bold text-lg md:text-xl tracking-wider px-1">
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
              placeholder="Ex: Compras do Mês, Feira..."
              maxLength={50}
              className={`w-full bg-white rounded-2xl h-12 md:h-14 px-4 text-base md:text-xl indent-2 text-[#5C2B10] placeholder:text-gray-400 font-medium outline-none border transition-all shadow-sm focus:ring-2 ${
                errors.tema_nome
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[#FDBA74] focus:border-[#E65C00] focus:ring-[#E65C00]/20"
              }`}
              autoFocus
            />
          </div>

          {/* Adicionar Itens */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#E65C00] font-bold text-lg md:text-xl tracking-wider px-1">
              Adicionar itens à lista
            </label>
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-start w-full">
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
                  className={`w-full bg-white rounded-2xl h-12 md:h-14 px-4 text-base md:text-xl indent-2 text-[#5C2B10] placeholder:text-gray-400 font-medium outline-none border transition-all shadow-sm focus:ring-2 ${
                    errors.item_nome
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-[#FDBA74] focus:border-[#E65C00] focus:ring-[#E65C00]/20"
                  }`}
                />
              </div>

              {/* Controles: Ativador de preço, Input preço e Input Quantidade */}
              <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto">
                <div className="flex-1 lg:flex-initial flex items-center gap-2 rounded-xl h-12 md:h-14 px-3 shadow-md bg-white/50 min-w-0">
                  <div
                    onClick={() => setIsPurchaseList(!isPurchaseList)}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-orange flex items-center justify-center cursor-pointer transition-transform active:scale-95 shrink-0"
                  >
                    {isPurchaseList && (
                      <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-orange rounded-full animate-fade-in" />
                    )}
                  </div>

                  <div
                    className={`flex-1 lg:flex-initial flex items-center bg-white rounded-lg px-2 h-8 w-24 sm:w-36 md:w-50 shadow-inner border ${
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
                      className="w-full bg-transparent text-center text-base md:text-xl text-[#E65C00] px-1 font-bold outline-none disabled:opacity-40"
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
                    className="w-12 md:w-20 h-8 bg-white rounded-lg text-center text-base md:text-xl text-[#E65C00] font-bold outline-none shadow-inner disabled:opacity-40"
                  />
                </div>

                <div className="h-12 md:h-14 flex items-center justify-center shrink-0">
                  <DefaultButton
                    onClick={handleAddLocalItem}
                    text="+"
                    another_size={"h-11 w-11 md:h-12 md:w-12"}
                    another_text_size={"text-2xl md:text-3xl"}
                    another_color={"bg-brown-dark"}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border border-orange/70 rounded-xl p-2 md:p-3 h-40 md:h-64 overflow-y-auto bg-white/40 shadow-inner [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-orange-dark/70 font-medium gap-1 text-center p-4">
                <span className="text-3xl md:text-5xl">🛒</span>
                <p className="text-base md:text-xl">
                  Nenhum item adicionado à lista.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div
                    key={item.id_map || item.id_item}
                    className="bg-[#FF8B40] text-white rounded-xl flex items-center justify-between px-3 md:px-8 py-2 md:py-2.5 shadow-sm"
                  >
                    <span className="flex-1 font-semibold truncate pr-2 text-sm md:text-xl">
                      {item.nome || item.nome_item}
                    </span>
                    <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                      <span className="text-white/80 font-medium text-xs md:text-xl">
                        R$ {formatCurrency(item.valor_unitario)} ×{" "}
                        {item.quantidade}
                      </span>

                      <div className="bg-white text-[#E65C00] font-bold px-2 py-0.5 md:py-1 rounded-lg text-xs md:text-xl shadow-inner text-right">
                        R${" "}
                        {formatCurrency(item.valor_unitario * item.quantidade)}
                      </div>
                      <button
                        onClick={() => handleRemoveLocalItem(item.id_item)}
                        className="bg-[#C24100]/20 hover:bg-red-600 hover:text-white transition-colors text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center font-bold text-xs md:text-sm cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rodapé fixado dentro do fluxo do modal (Total e Ações) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-[#E65C00]/10">
            <div>
              {isPurchaseList && (
                <h3 className="text-[#E65C00] font-extrabold text-lg md:text-xl flex items-center flex-wrap gap-1">
                  Total da compra:
                  <span className="text-[#5C2B10] bg-white text-lg md:text-xl px-2.5 py-0.5 md:py-1 rounded-lg border border-[#FDBA74] shadow-sm">
                    R$ {formatCurrency(totalPurchase)}
                  </span>
                </h3>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <DefaultButton
                onClick={onClose}
                text="Cancelar"
                theme={false}
                another_size="w-full sm:w-auto"
                another_padding={"px-4 sm:px-12 py-2 md:py-2.5"}
                another_text_size={"text-base md:text-xl font-semibold"}
              />
              <DefaultButton
                onClick={function () {
                  if (isEdit) {
                    handleSaveEditions();
                  } else {
                    handleSave();
                  }
                }}
                text={isEdit ? "Salvar Alterações" : "Criar Lista"}
                another_size="w-full sm:w-auto"
                another_padding={"px-4 sm:px-12 py-2 md:py-2.5"}
                another_text_size={"text-base md:text-xl font-semibold"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalList;
