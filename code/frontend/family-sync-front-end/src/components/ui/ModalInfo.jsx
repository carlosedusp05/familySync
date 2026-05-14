import { useState, useEffect, useRef } from "react";
import { pencilTerracotaIcon } from "../../assets";
import { motion, AnimatePresence } from "framer-motion";
import DefaultButton from "./DefaultButton";

function ModalInfo({
  isOpen,
  onClose,
  data = null,
  onDelete,
  onSave,
  isInitialEdit,
}) {
  const isEdit = Boolean(data);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: false, description: false });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editableFields, setEditableFields] = useState({
    title: false,
    description: false,
  });

  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsConfirmingDelete(false);
      setErrors({ title: false, description: false });
      setTitle(data?.title || "");
      setDescription(data?.desc || "");

      setEditableFields({
        title: !isEdit,
        description: !isEdit,
      });
    }
  }, [isOpen, data, isEdit]);

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
    const currentTitle = title || "";
    const currentDesc = description || "";

    const titleError = !currentTitle.trim();
    const descError = !currentDesc.trim();

    setErrors({ title: titleError, description: descError });

    if (!titleError && !descError) {
      onSave({
        title: currentTitle,
        description: currentDesc,
      });
    }
  };

  const isGlobalEditFlow = !isEdit || isInitialEdit;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ willChange: "opacity" }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transform-gpu"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ willChange: "transform, opacity" }}
            className="relative bg-[#FEF6E4] w-full max-w-7xl p-8 rounded-[40px] shadow-2xl border border-white/20 flex flex-col gap-6 z-10 transform-gpu backface-hidden"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-brown-dark text-3xl font-bold">
                {isGlobalEditFlow
                  ? isEdit
                    ? "Editar Informação"
                    : "Adicionar informação familiar"
                  : "Visualizar Informação"}
              </h2>
              <p className="text-[#5D2A11]/60">
                {isGlobalEditFlow
                  ? "Clique no ícone de lápis para liberar a edição dos campos."
                  : "Visualize os detalhes registrados abaixo."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-1">
                  <label className="text-[#5D2A11] text-[18px] font-semibold">
                    Título da informação
                  </label>
                  {isGlobalEditFlow && isEdit && (
                    <button
                      onClick={() => toggleEdit("title", titleRef)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <img
                        src={pencilTerracotaIcon}
                        alt="Editar"
                        className={`w-7 h-7 transition-all ${
                          editableFields.title ? "opacity-100" : "opacity-40"
                        }`}
                      />
                    </button>
                  )}
                </div>

                <div className="relative flex items-center w-full">
                  <div className="inline-grid items-center w-full max-w-full overflow-hidden">
                    <span className="invisible col-start-1 row-start-1 px-1 text-[18px] font-medium whitespace-pre-wrap wrap-break-word border-b-2 border-transparent">
                      {title || "Título (ex: Alergia a Glúten severa)"}
                    </span>

                    {isGlobalEditFlow ? (
                      <input
                        ref={titleRef}
                        type="text"
                        value={title}
                        maxLength={100}
                        readOnly={!editableFields.title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (errors.title && e.target.value.trim() !== "")
                            setErrors((prev) => ({ ...prev, title: false }));
                        }}
                        placeholder="Título (ex: Alergia a Glúten severa)"
                        className={`col-start-1 row-start-1 w-full py-2 px-1 outline-none transition-all bg-transparent text-[#5D2A11] text-[18px] font-medium
                    ${
                      errors.title
                        ? "border-b-2 border-red-500"
                        : editableFields.title
                          ? "border-b-2 border-[#5D2A11]/30"
                          : "border-b-2 border-transparent"
                    }`}
                        style={{ textIndent: "5px" }}
                      />
                    ) : (
                      <h1 className="col-start-1 row-start-1 text-[#5D2A11] text-[18px] font-medium px-1 whitespace-pre-wrap wrap-break-word leading-normal w-full border-b-2 border-transparent">
                        {title}
                      </h1>
                    )}
                  </div>
                </div>
                {errors.title && (
                  <span className="text-red-500 text-xs mt-1 block px-1">
                    O título é obrigatório.
                  </span>
                )}
              </div>

              {/* DESCRIÇÃO */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[#5D2A11] text-[18px] font-semibold">
                      Detalhes
                    </label>
                    {isGlobalEditFlow && isEdit && (
                      <button
                        onClick={() => toggleEdit("description", descRef)}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <img
                          src={pencilTerracotaIcon}
                          alt="Editar"
                          className={`w-7 h-7 transition-all ${
                            editableFields.description
                              ? "opacity-100"
                              : "opacity-40"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {editableFields.description && isGlobalEditFlow && (
                    <span
                      className={`text-xs ${
                        description.length >= 950
                          ? "text-red-500 font-bold"
                          : "text-[#5D2A11]/50"
                      }`}
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
                    rows="5"
                    style={{ textIndent: "5px" }}
                    className={`w-full p-4 rounded-2xl outline-none transition-colors resize-none text-[#5D2A11] text-[18px]
                ${
                  errors.description
                    ? "border-2 border-red-500"
                    : editableFields.description
                      ? "border border-[#5D2A11]/10 bg-white/50"
                      : "bg-[#E0E0E0]/50"
                }`}
                  />
                ) : (
                  <div className="bg-[#5D2A11]/5 p-6 rounded-2xl min-h-[150px] w-full">
                    <p className="text-[#5D2A11] text-[20px] leading-relaxed whitespace-pre-wrap wrap-break-word">
                      {description}
                    </p>
                  </div>
                )}
                {errors.description && (
                  <span className="text-red-500 text-xs mt-1 px-1">
                    A descrição é obrigatória.
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full gap-3 mt-4 justify-end items-center h-14 relative z-20">
              {!isConfirmingDelete ? (
                <>
                  <DefaultButton
                    another_color="bg-[#BDC3C7]"
                    another_text_color="text-zinc-700"
                    another_text_size="text-[20px]"
                    another_size="h-14 w-50"
                    text={isGlobalEditFlow ? "Cancelar" : "Fechar"}
                    onClick={onClose}
                  />
                  {isGlobalEditFlow && (
                    <>
                      <DefaultButton
                        text={isEdit ? "Salvar Edição" : "Salvar Informação"}
                        another_text_size="text-[20px]"
                        another_size="h-14 w-50"
                        onClick={handleSave}
                      />
                      {isEdit && (
                        <DefaultButton
                          text="Excluir"
                          another_color="bg-red-light"
                          another_text_size="text-[20px]"
                          another_size="h-14 w-50"
                          onClick={() => setIsConfirmingDelete(true)}
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex items-center gap-4 bg-white/40 px-6 rounded-2xl border border-brown-dark/20 h-14"
                >
                  <span className="text-[#5D2A11] font-bold text-[18px]">
                    Deseja excluir permanentemente?
                  </span>
                  <DefaultButton
                    onClick={() => setIsConfirmingDelete(false)}
                    another_color="bg-[#BDC3C7]"
                    another_text_color="text-zinc-700"
                    another_size="h-10 w-24"
                    text="Não"
                  />
                  <DefaultButton
                    onClick={() => {
                      onDelete && onDelete(data.id);
                      onClose();
                    }}
                    another_color="bg-red-light"
                    another_size="h-10 w-40"
                    text="Sim, Excluir"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ModalInfo;
