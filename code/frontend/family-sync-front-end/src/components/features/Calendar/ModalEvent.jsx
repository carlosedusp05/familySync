import LargeCard from "../../ui/LargeCard";
import { pencilTerracotaIcon } from "../../../assets";
import { useEffect, useRef, useState } from "react";
import DefaultButton from "../../ui/DefaultButton";
import { motion, AnimatePresence } from "framer-motion";

function ModalEvents({
  isOpen,
  onClose,
  selectedDate,
  data = null,
  onDelete,
  onSave,
  isInitialEdit,
  isLoading,
}) {
  const isEdit = Boolean(data);

  const [hours, setHours] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    hours: false,
    title: false,
    description: false,
  });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editableFields, setEditableFields] = useState({
    hours: false,
    title: false,
    description: false,
  });
  const hoursRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsConfirmingDelete(false);
      setErrors({ hours: false, title: false, description: false });
      setHours(data?.hora || "");
      setTitle(data?.titulo || "");
      setDescription(data?.descricao || "");

      setEditableFields({
        hours: !isEdit,
        title: !isEdit,
        description: !isEdit,
      });
    }
  }, [isOpen, data, isEdit]);

  if (!isOpen) return null;

  const toggleEdit = (field, ref = null) => {
    setEditableFields((prev) => {
      const isNowEditable = !prev[field];
      if (isNowEditable && ref && ref.current) {
        setTimeout(() => ref.current.focus(), 50);
      }
      return { ...prev, [field]: isNowEditable };
    });
  };

  const handleSave = () => {
    const currentHours = hours || "";
    const currentTitle = title || "";
    const currentDesc = description || "";

    const hoursError = !currentHours.trim();
    const titleError = !currentTitle.trim();
    const descError = !currentDesc.trim();

    setErrors({ hours: hoursError, title: titleError, description: descError });

    if (!hoursError && !titleError && !descError) {
      onSave({
        date: selectedDate,
        hours: currentHours,
        title: currentTitle,
        description: currentDesc,
      });
    }
  };

  const isGlobalEditFlow = !isEdit || isInitialEdit;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Largura máxima escalável e barra de rolagem se o conteúdo exceder a tela do mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-[#FEF6E4] w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-5xl rounded-[24px] md:rounded-[40px] flex flex-col z-10 max-h-[90vh] overflow-y-auto"
        >
          <LargeCard
            color={"bg-yellow-light"}
            p={"p-4 sm:p-6 md:p-10"}
            size={"w-full relative"}
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-brown-dark text-xl md:text-3xl font-bold">
                {isGlobalEditFlow
                  ? isEdit
                    ? "Editar Evento"
                    : "Adicionar Evento familiar"
                  : "Visualizar Evento"}
              </h2>
              <p className="text-[#5D2A11]/60 text-xs md:text-sm">
                {isGlobalEditFlow
                  ? "Clique no ícone de lápis para liberar a edição."
                  : "Detalhes registrados abaixo."}
              </p>
            </div>

            {/* Cabeçalho de data e hora responsivo (empilha se necessário) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 md:py-6 gap-4 border-b border-brown-dark/10 mb-4">
              <div className="font-bold text-lg md:text-2xl text-brown-dark">
                {data ? <p>DIA: {data.data}</p> : <p>DIA: {selectedDate}</p>}
              </div>

              <div className="flex items-center flex-col w-full sm:w-auto">
                <div className="flex gap-3 items-center justify-end w-full">
                  {editableFields.hours ? (
                    <input
                      ref={hoursRef}
                      type="time"
                      value={hours}
                      onChange={(e) => {
                        setHours(e.target.value);
                        if (errors.hours && e.target.value.trim() !== "")
                          setErrors((prev) => ({ ...prev, hours: false }));
                      }}
                      className={`focus:border-[#5D2A11] bg-terracota text-white w-28 md:w-30 h-10 md:h-12 p-2 text-center font-bold rounded-xl outline-none border-b-2 ${
                        errors.hours ? "border-red-500" : "border-transparent"
                      }`}
                    />
                  ) : (
                    <div className="w-28 md:w-30 h-10 md:h-12 bg-terracota text-white px-4 font-bold rounded-xl p-2 text-center flex items-center justify-center">
                      {hours}
                    </div>
                  )}
                  {isGlobalEditFlow && isEdit && (
                    <button onClick={() => toggleEdit("hours", hoursRef)}>
                      <img
                        src={pencilTerracotaIcon}
                        alt="Editar"
                        className={`w-6 h-6 md:w-7 md:h-7 ${editableFields.hours ? "opacity-100" : "opacity-40"}`}
                      />
                    </button>
                  )}
                </div>
                {errors.hours && (
                  <span className="text-red-500 text-xs mt-1">
                    O horário é obrigatório.
                  </span>
                )}
              </div>
            </div>

            {/* Campos de Input */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="text-[#5D2A11] text-[16px] md:text-[18px] font-semibold">
                    Título do Evento
                  </label>
                  {isGlobalEditFlow && isEdit && (
                    <button
                      onClick={() => toggleEdit("title", titleRef)}
                      className="hover:scale-110 transition-transform"
                    >
                      <img
                        src={pencilTerracotaIcon}
                        alt="Editar"
                        className={`w-6 h-6 ${editableFields.title ? "opacity-100" : "opacity-40"}`}
                      />
                    </button>
                  )}
                </div>
                {isGlobalEditFlow ? (
                  <input
                    ref={titleRef}
                    type="text"
                    value={title}
                    maxLength={50}
                    readOnly={!editableFields.title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title && e.target.value.trim() !== "")
                        setErrors((prev) => ({ ...prev, title: false }));
                    }}
                    placeholder="Título (ex: Formatura do Pedro)"
                    className={`w-full py-2 px-1 bg-transparent text-[#5D2A11] text-[16px] md:text-[18px] font-medium border-b-2 outline-none ${
                      errors.title
                        ? "border-red-500"
                        : editableFields.title
                          ? "border-[#5D2A11]/30"
                          : "border-transparent"
                    }`}
                  />
                ) : (
                  <h1 className="text-[#5D2A11] text-[16px] md:text-[18px] font-medium py-2">
                    {title}
                  </h1>
                )}
                {errors.title && (
                  <span className="text-red-500 text-xs">
                    O título é obrigatório.
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-[#5D2A11] text-[16px] md:text-[18px] font-semibold">
                      Detalhes
                    </label>
                    {isGlobalEditFlow && isEdit && (
                      <button
                        onClick={() => toggleEdit("description", descRef)}
                        className="hover:scale-110 transition-transform"
                      >
                        <img
                          src={pencilTerracotaIcon}
                          alt="Editar"
                          className={`w-6 h-6 ${editableFields.description ? "opacity-100" : "opacity-40"}`}
                        />
                      </button>
                    )}
                  </div>
                  {editableFields.description && isGlobalEditFlow && (
                    <span
                      className={`text-xs ${description.length >= 950 ? "text-red-500 font-bold" : "text-[#5D2A11]/50"}`}
                    >
                      {description.length} / 1000
                    </span>
                  )}
                </div>
                {isGlobalEditFlow ? (
                  <textarea
                    ref={descRef}
                    value={description}
                    maxLength={1000}
                    readOnly={!editableFields.description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description && e.target.value.trim() !== "")
                        setErrors((prev) => ({ ...prev, description: false }));
                    }}
                    placeholder="Descrição detalhada..."
                    rows="4"
                    className={`w-full p-3 rounded-xl outline-none text-[16px] md:text-[18px] text-[#5D2A11] resize-none ${
                      errors.description
                        ? "border-2 border-red-500"
                        : editableFields.description
                          ? "border border-[#5D2A11]/10 bg-white/50"
                          : "bg-[#E0E0E0]/50"
                    }`}
                  />
                ) : (
                  <div className="bg-[#5D2A11]/5 p-4 rounded-xl min-h-[100px] w-full">
                    <p className="text-[#5D2A11] text-[16px] md:text-[18px] leading-relaxed whitespace-pre-wrap break-words">
                      {description}
                    </p>
                  </div>
                )}
                {errors.description && (
                  <span className="text-red-500 text-xs">
                    A descrição é obrigatória.
                  </span>
                )}
              </div>
            </div>

            {/* Área de botões responsiva (empilha em telas muito pequenas) */}
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 md:gap-3 mt-6 justify-end items-center">
              {!isConfirmingDelete ? (
                <>
                  <DefaultButton
                    another_color="bg-terracota"
                    another_text_size="text-[16px] md:text-[18px]"
                    another_size="h-11 md:h-14 flex-1 sm:flex-none sm:w-40"
                    text={isGlobalEditFlow ? "Cancelar" : "Fechar"}
                    onClick={onClose}
                  />
                  {isGlobalEditFlow && (
                    <>
                      <DefaultButton
                        text={isEdit ? "Salvar" : "Salvar Evento"}
                        another_color="bg-default"
                        another_text_size="text-[16px] md:text-[18px]"
                        another_size="h-11 md:h-14 flex-1 sm:flex-none sm:w-40"
                        onClick={handleSave}
                        disabled={isLoading}
                      />
                      {isEdit && (
                        <DefaultButton
                          text="Excluir"
                          another_color="bg-red-light"
                          another_text_size="text-[16px] md:text-[18px]"
                          another_size="h-11 md:h-14 w-full sm:w-32"
                          onClick={() => setIsConfirmingDelete(true)}
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/40 p-3 rounded-xl border border-brown-dark/20 w-full justify-end">
                  <span className="text-brown-dark font-bold text-sm md:text-base text-center sm:text-left">
                    Deseja excluir permanentemente?
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <DefaultButton
                      onClick={() => setIsConfirmingDelete(false)}
                      another_color="bg-[#BDC3C7]"
                      another_text_color="text-zinc-700"
                      another_size="h-9 w-20 flex-1 sm:flex-none"
                      text="Não"
                    />
                    <DefaultButton
                      onClick={() => {
                        onDelete(data.id_eventos);
                        onClose();
                      }}
                      another_color="bg-red-light"
                      another_size="h-9 w-28 flex-1 sm:flex-none"
                      text="Sim, Excluir"
                    />
                  </div>
                </div>
              )}
            </div>
          </LargeCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ModalEvents;
