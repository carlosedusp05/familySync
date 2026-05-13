import LargeCard from "./LargeCard";
import { pencilTerracotaIcon } from "../../assets";
import { useEffect, useRef, useState } from "react";
import { space } from "postcss/lib/list";
import DefaultButton from "./DefaultButton";
import { div, input } from "framer-motion/client";

function ModalEvents({
  isOpen,
  onClose,
  selectedDate,
  data = null,
  onDelete,
  onSave,
  isInitialEdit,
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
      setHours(data?.hours || "");
      setTitle(data?.title || "");
      setDescription(data?.desc || "");

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

    console.log(currentHours, currentTitle);

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
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <LargeCard
        color={"bg-yellow-light"}
        p={"p-18"}
        size={" w-full max-w-7xl relative"}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-brown-dark text-3xl font-bold">
            {isGlobalEditFlow
              ? isEdit
                ? "Editar Evento"
                : "Adicionar Evento familiar"
              : "Visualizar Evento"}
          </h2>
          <p className="text-[#5D2A11]/60">
            {isGlobalEditFlow
              ? "Clique no ícone de lápis para liberar a edição dos campos."
              : "Visualize os detalhes registrados abaixo."}
          </p>
        </div>

        <div className="flex justify-between items-center py-10">
          <div className="font-bold text-2xl">
            <p>DIA: {selectedDate}</p>
          </div>
          <div className="flex items-center justify-center text-center flex-col">
            <div className="flex gap-3 items-center justify-center">
              {editableFields.hours ? (
                <input
                  ref={hoursRef}
                  type="time"
                  value={hours}
                  readOnly={!editableFields.hours}
                  onChange={(e) => {
                    setHours(e.target.value);
                    if (errors.hours && e.target.value.trim() !== "")
                      setErrors((prev) => ({ ...prev, hours: false }));
                  }}
                  className={`focus:border-[#5D2A11] bg-terracota text-white w-30 h-12 p-3 text-center font-bold rounded-2xl outline-none border-transparent
                   ${
                     errors.hours
                       ? "border-b-2 border-red-500"
                       : editableFields.hours
                         ? "border-b-2 border-[#5D2A11]/30"
                         : "border-b-2 border-transparent"
                   }`}
                  style={{ textIndent: "5px" }}
                />
              ) : (
                <div className="focus:border-[#5D2A11] w-30 h-12 bg-terracota text-white  px-5 font-bold rounded-2xl p-3 text-center">
                  {hours}
                </div>
              )}
              {isGlobalEditFlow && isEdit && (
                <button
                  onClick={() => toggleEdit("hours", hoursRef)}
                  className="transition-transform"
                >
                  <img
                    src={pencilTerracotaIcon}
                    alt="Editar"
                    className={`w-7 h-7 transition-all ${
                      editableFields.hours ? "opacity-100" : "opacity-40"
                    }`}
                  />
                </button>
              )}
            </div>
            <div className="h-5">
              {errors.hours && (
                <span className="text-red-500 text-xs mt-1 block px-1">
                  O horário é obrigatório.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <label className="text-[#5D2A11] text-[18px] font-semibold">
                Título do Evento
              </label>
              {isGlobalEditFlow && isEdit && (
                <button
                  onClick={() => toggleEdit("title", titleRef)}
                  className="transition-transform hover:scale-110"
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
                  {title || "Título (ex: Formatura do Pedro)"}
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
                    placeholder="Título (ex: Formatura do Pedro)"
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

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <label className="text-[#5D2A11] text-[18px] font-semibold">
                  Detalhes
                </label>
                {isGlobalEditFlow && isEdit && (
                  <button
                    onClick={() => toggleEdit("description", descRef)}
                    className="transition-transform hover:scale-110"
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
              <div className="bg-[#5D2A11]/5 p-6 rounded-2xl min-h-37.5 w-full">
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
        <div className="flex w-full gap-3 mt-4 justify-end items-center h-14">
          {!isConfirmingDelete ? (
            <>
              <DefaultButton
                another_color="bg-terracota"
                another_text_size="text-[20px]"
                another_size="h-14 w-50"
                text={isGlobalEditFlow ? "Cancelar" : "Fechar"}
                onClick={onClose}
              />
              {isGlobalEditFlow && (
                <>
                  <DefaultButton
                    text={isEdit ? "Salvar Edição" : "Salvar Evento"}
                    another_color="bg-default"
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
            <div className="flex items-center gap-4 animate-fade-in bg-white/40 px-6 rounded-2xl border border-brown-dark/20 h-14">
              <span className="text-brown-dark font-bold text-[18px]">
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
            </div>
          )}
        </div>
      </LargeCard>
    </div>
  );
}

export default ModalEvents;
