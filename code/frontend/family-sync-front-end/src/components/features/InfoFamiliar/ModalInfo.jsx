import { useState, useEffect, useRef } from "react";
import DefaultButton from "../../ui/DefaultButton";

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
  const [isEditingMode, setIsEditingMode] = useState(false);

  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsConfirmingDelete(false);
      setErrors({ title: false, description: false });
      setTitle(data?.titulo || "");
      setDescription(data?.descricao || "");
      setIsEditingMode(!data || isInitialEdit);
    }
  }, [isOpen, data, isInitialEdit]);

  const handleSave = () => {
    const safeTitle = title?.trim() || "";
    const safeDesc = description?.trim() || "";
    const titleError = !safeTitle;
    const descError = !safeDesc;

    setErrors({ title: titleError, description: descError });

    if (!titleError && !descError) {
      onSave({
        title: safeTitle,
        description: safeDesc,
      });
    }
  };

  const handleCancelEdit = () => {
    if (isEdit) {
      setIsEditingMode(false);
      setTitle(data?.titulo || "");
      setDescription(data?.descricao || "");
      setErrors({ title: false, description: false });
    } else {
      onClose();
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 transition-opacity duration-200"
            onClick={onClose}
          />
          <div className="relative bg-[#FEF6E4] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 md:p-8 rounded-3xl md:rounded-[32px] shadow-2xl border border-white/20 flex flex-col gap-4 md:gap-6 z-10 transition-transform duration-200 ease-out custom-scrollbar">
            <div className="flex flex-col gap-1 md:gap-2">
              <h2 className="text-brown-dark text-xl md:text-2xl font-bold">
                {isEditingMode
                  ? isEdit
                    ? "Editar Informação"
                    : "Adicionar informação familiar"
                  : "Visualizar Informação"}
              </h2>
              <p className="text-[#5D2A11]/60 text-xs md:text-sm">
                {isEditingMode
                  ? "Edite os detalhes da informação abaixo."
                  : "Visualize os detalhes registrados abaixo."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-1">
                  <label className="text-[#5D2A11] text-sm md:text-base font-semibold">
                    Título da informação
                  </label>
                </div>

                <div className="relative flex items-center w-full">
                  <div className="inline-grid items-center w-full max-w-full overflow-hidden">
                    {isEditingMode ? (
                      <input
                        ref={titleRef}
                        type="text"
                        value={title}
                        maxLength={100}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (errors.title)
                            setErrors((prev) => ({ ...prev, title: false }));
                        }}
                        placeholder="Ex: Alergia a Glúten severa"
                        className={`col-start-1 row-start-1 w-full py-1.5 px-1 outline-none transition-all bg-transparent text-[#5D2A11] text-lg md:text-xl font-medium
                          ${errors.title ? "border-b-2 border-red-500" : "border-b-2 border-[#5D2A11]/30"}`}
                        style={{ textIndent: "5px" }}
                      />
                    ) : (
                      <h1 className="col-start-1 row-start-1 text-[#5D2A11] text-lg md:text-xl font-medium px-1 whitespace-pre-wrap break-words leading-normal w-full border-b-2 border-transparent">
                        {title}
                      </h1>
                    )}
                  </div>
                </div>
                {errors.title && (
                  <span className="text-red-500 text-[14px] mt-1 block px-1">
                    O título é obrigatório.
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[#5D2A11] text-sm md:text-base font-semibold">
                    Detalhes
                  </label>
                  {isEditingMode && (
                    <span
                      className={`text-[10px] md:text-xs ${description.length >= 950 ? "text-red-500 font-bold" : "text-[#5D2A11]/50"}`}
                    >
                      {description.length} / 1000
                    </span>
                  )}
                </div>

                {isEditingMode ? (
                  <textarea
                    ref={descRef}
                    value={description}
                    maxLength={1000}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description)
                        setErrors((prev) => ({ ...prev, description: false }));
                    }}
                    placeholder="Descrição detalhada..."
                    rows="4"
                    className={`w-full p-3 rounded-xl outline-none transition-colors resize-none text-[#5D2A11] text-sm md:text-base bg-white/50
                      ${errors.description ? "border-2 border-red-500" : "border border-[#5D2A11]/10"}`}
                  />
                ) : (
                  <div className="bg-[#5D2A11]/5 p-3 md:p-4 rounded-xl min-h-[6rem] w-full">
                    <p className="text-[#5D2A11] text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {description}
                    </p>
                  </div>
                )}
                {errors.description && (
                  <span className="text-red-500 text-[14px] mt-1 px-1">
                    A descrição é obrigatória.
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full gap-3 mt-2 justify-center md:justify-end items-center relative z-20">
              {!isConfirmingDelete ? (
                <div className="flex flex-col sm:flex-row gap-2 transition-all duration-300 w-full sm:w-auto">
                  {!isEditingMode ? (
                    <>
                      <DefaultButton
                        another_color="bg-[#BDC3C7]"
                        another_text_color="text-zinc-700"
                        another_text_size="text-sm md:text-base"
                        another_size="h-10 md:h-12 w-full sm:w-28 md:w-36"
                        text="Fechar"
                        onClick={onClose}
                      />
                      <DefaultButton
                        text="Editar"
                        another_text_size="text-sm md:text-base"
                        another_size="h-10 md:h-12 w-full sm:w-28 md:w-36"
                        onClick={() => setIsEditingMode(true)}
                      />
                    </>
                  ) : (
                    <>
                      <DefaultButton
                        another_color="bg-[#BDC3C7]"
                        another_text_color="text-zinc-700"
                        another_text_size="text-sm md:text-base"
                        another_size="h-10 md:h-12 w-full sm:w-28 md:w-36"
                        text="Cancelar"
                        onClick={handleCancelEdit}
                      />
                      <DefaultButton
                        text={isEdit ? "Salvar" : "Salvar"}
                        another_text_size="text-sm md:text-base"
                        another_size="h-10 md:h-12 w-full sm:w-32 md:w-36 px-2"
                        onClick={handleSave}
                      />
                      {isEdit && (
                        <DefaultButton
                          text="Excluir"
                          another_color="bg-red-light"
                          another_text_size="text-sm md:text-base"
                          another_size="h-10 md:h-12 w-full sm:w-28 md:w-36"
                          onClick={() => setIsConfirmingDelete(true)}
                        />
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-white/40 p-3 md:px-5 rounded-xl border border-brown-dark/20 w-full md:w-auto">
                  <span className="text-[#5D2A11] font-bold text-sm text-center sm:text-left">
                    Excluir permanentemente?
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <DefaultButton
                      onClick={() => setIsConfirmingDelete(false)}
                      another_color="bg-[#BDC3C7]"
                      another_text_color="text-zinc-700"
                      another_size="h-9 w-full sm:w-20"
                      another_text_size="text-xs md:text-sm"
                      text="Não"
                    />
                    <DefaultButton
                      onClick={() => {
                        onDelete && onDelete(data.id_info);
                        onClose();
                      }}
                      another_color="bg-red-light"
                      another_size="h-9 w-full sm:w-28"
                      another_text_size="text-xs md:text-sm"
                      text="Sim, Excluir"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalInfo;
