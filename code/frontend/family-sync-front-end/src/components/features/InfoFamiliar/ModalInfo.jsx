import { useState, useEffect, useRef } from "react";
import { pencilTerracotaIcon } from "../../../assets"; // Você pode remover se não for mais usar o ícone
import DefaultButton from "../../ui/DefaultButton";

function ModalInfo({
  isOpen,
  onClose,
  data = null,
  onDelete,
  onSave,
  isInitialEdit,
}) {
  const isEdit = Boolean(data); // true se já existe uma info (estamos visualizando/editando)

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: false, description: false });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Este estado controla se os inputs estão liberados para digitação
  const [isEditingMode, setIsEditingMode] = useState(false);

  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsConfirmingDelete(false);
      setErrors({ title: false, description: false });
      setTitle(data?.titulo || "");
      setDescription(data?.descricao || "");

      // Se não tem dados (é criação) ou veio configurado para edição inicial, abre editando
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
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 transition-opacity duration-200"
            onClick={onClose}
          />
          <div className="relative bg-[#FEF6E4] w-full max-w-7xl p-8 rounded-[40px] shadow-2xl border border-white/20 flex flex-col gap-6 z-10 transition-transform duration-200 ease-out">
            <div className="flex flex-col gap-2">
              <h2 className="text-brown-dark text-3xl font-bold">
                {isEditingMode
                  ? isEdit
                    ? "Editar Informação"
                    : "Adicionar informação familiar"
                  : "Visualizar Informação"}
              </h2>
              <p className="text-[#5D2A11]/60">
                {isEditingMode
                  ? "Edite os detalhes da informação abaixo."
                  : "Visualize os detalhes registrados abaixo."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-1">
                  <label className="text-[#5D2A11] text-[18px] font-semibold">
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
                        placeholder="Título (ex: Alergia a Glúten severa)"
                        className={`col-start-1 row-start-1 w-full py-2 px-1 outline-none transition-all bg-transparent text-[#5D2A11] text-3xl font-medium
                          ${errors.title ? "border-b-2 border-red-500" : "border-b-2 border-[#5D2A11]/30"}`}
                        style={{ textIndent: "5px" }}
                      />
                    ) : (
                      <h1 className="col-start-1 row-start-1 text-[#5D2A11] text-3xl font-medium px-1 whitespace-pre-wrap wrap-break-word leading-normal w-full border-b-2 border-transparent">
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
                  <label className="text-[#5D2A11] text-[18px] font-semibold">
                    Detalhes
                  </label>
                  {isEditingMode && (
                    <span
                      className={`text-xs ${description.length >= 950 ? "text-red-500 font-bold" : "text-[#5D2A11]/50"}`}
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
                    rows="5"
                    style={{ textIndent: "5px" }}
                    className={`w-full p-4 rounded-2xl outline-none transition-colors resize-none text-[#5D2A11] text-[18px] bg-white/50
                      ${errors.description ? "border-2 border-red-500" : "border border-[#5D2A11]/10"}`}
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

            <div className="flex w-full gap-3 mt-4 justify-end items-center h-14 relative z-20">
              {!isConfirmingDelete ? (
                <div className="flex gap-3 transition-all duration-300">
                  {!isEditingMode ? (
                    <>
                      <DefaultButton
                        another_color="bg-[#BDC3C7]"
                        another_text_color="text-zinc-700"
                        another_text_size="text-[20px]"
                        another_size="h-14 w-50"
                        text="Fechar"
                        onClick={onClose}
                      />
                      <DefaultButton
                        text="Editar"
                        another_text_size="text-[20px]"
                        another_size="h-14 w-50"
                        onClick={() => setIsEditingMode(true)}
                      />
                    </>
                  ) : (
                    // MODO DE EDIÇÃO
                    <>
                      <DefaultButton
                        another_color="bg-[#BDC3C7]"
                        another_text_color="text-zinc-700"
                        another_text_size="text-[20px]"
                        another_size="h-14 w-50"
                        text="Cancelar"
                        onClick={handleCancelEdit}
                      />
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
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-white/40 px-6 rounded-2xl border border-brown-dark/20 h-14">
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
                      onDelete && onDelete(data.id_info);
                      onClose();
                    }}
                    another_color="bg-red-light"
                    another_size="h-10 w-40"
                    text="Sim, Excluir"
                  />
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
