import { useState, useEffect, useRef } from "react";
import { pencilTerracotaIcon } from "../../assets";
import DefaultButton from "./DefaultButton";

function ModalInfo({ isOpen, onClose, data = null, onDelete }) {
  const isEdit = Boolean(data);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const [editableFields, setEditableFields] = useState({
    title: false,
    participants: false,
    description: false,
  });

  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsConfirmingDelete(false);
      setTitle(data?.title || "");
      setDescription(data?.description || "");
      setParticipants(data?.participants || []);
      setInputValue("");

      setEditableFields({
        title: !isEdit,
        participants: !isEdit,
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

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#FEF6E4] w-full max-w-7xl p-8 rounded-[40px] shadow-2xl border border-white/20 flex flex-col gap-6 animate-scale-up">
        <div className="flex flex-col gap-2">
          <h2 className="text-brown-dark text-3xl font-bold">
            {isEdit
              ? "Detalhes da Informação"
              : "Adicionar informação familiar"}
          </h2>
          <p className="text-[#5D2A11]/60">
            {isEdit
              ? "Visualize ou edite os detalhes desta condição."
              : "Preencha os detalhes da nova alergia ou condição médica."}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <label className="text-[#5D2A11] text-[18px] font-semibold">
                Título da informação
              </label>
              {isEdit && (
                <button
                  onClick={() => toggleEdit("title", titleRef)}
                  className="transition-transform hover:scale-110"
                >
                  <img
                    src={pencilTerracotaIcon}
                    alt="Editar"
                    className={`w-7 h-7 transition-all ${editableFields.title ? "opacity-100" : "opacity-60"}`}
                  />
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <div className="inline-grid items-center min-w-[15%] max-w-full">
                <span className="invisible col-start-1 row-start-1 px-1 text-[18px] font-medium whitespace-pre border-b-2 border-transparent">
                  {title || "Título (ex: Alergia a Glúten severa)"}
                </span>
                <input
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  readOnly={!editableFields.title}
                  placeholder="Título (ex: Alergia a Glúten severa)"
                  className={`col-start-1 row-start-1 w-full py-2 px-1 outline-none transition-all placeholder:text-[#5D2A11]/40
                    ${
                      editableFields.title
                        ? "border-b-2 border-[#5D2A11]/30 bg-transparent focus:border-orange-dark rounded-none"
                        : "bg-transparent text-[#5D2A11] text-[18px] font-medium border-b-2 border-transparent"
                    }`}
                  style={{ textIndent: "5px" }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <label className="text-[#5D2A11] text-[18px] font-semibold">
                Detalhes
              </label>
              {isEdit && (
                <button
                  onClick={() => toggleEdit("description", descRef)}
                  className="transition-transform hover:scale-110"
                >
                  <img
                    src={pencilTerracotaIcon}
                    alt="Editar"
                    className={`w-7 h-7 transition-all ${editableFields.description ? "opacity-100" : "opacity-60"}`}
                  />
                </button>
              )}
            </div>

            <textarea
              ref={descRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              readOnly={!editableFields.description}
              placeholder="Descrição detalhada sobre sintomas, precauções e tratamento emergencial..."
              rows="5"
              style={{ textIndent: "5px" }}
              className={`w-full p-4 rounded-2xl outline-none transition-colors resize-none placeholder:text-[#5D2A11]/40
                ${
                  editableFields.description
                    ? "border border-[#5D2A11]/10 bg-white/50 focus:border-orange-dark"
                    : "bg-[#E0E0E0]/80 text-[#5D2A11] text-[18px] border border-transparent"
                }`}
            />
          </div>
        </div>

        <div className="flex w-full gap-3 mt-4 justify-end items-center h-14">
          {!isConfirmingDelete ? (
            <>
              <DefaultButton
                another_color="bg-[#BDC3C7]"
                another_text_color="text-zinc-700"
                another_text_size="text-[20px]"
                another_size="h-14 w-50"
                text="Cancelar"
                onClick={onClose}
              />
              <DefaultButton
                text={isEdit ? "Salvar Edição" : "Salvar Informação"}
                another_text_size="text-[20px]"
                another_size="h-14 w-50"
                onClick={() => {
                  console.log("Salvo:", { title, description });
                  onClose();
                }}
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
          ) : (
            <div className="flex items-center gap-4 animate-fade-in bg-white/40 px-6 rounded-2xl border border-brown-dark/20 h-14">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalInfo;
