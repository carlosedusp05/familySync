import DefaultButton from "../../ui/DefaultButton";
import { trashIconRed } from "../../../assets";

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Sim, Remover",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-xl flex flex-col gap-4 sm:gap-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
          <img
            src={trashIconRed}
            alt="Ícone deletar"
            className="h-7 w-7 sm:h-8 sm:w-8"
          />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-3 mt-2 w-full">
          <DefaultButton
            onClick={onClose}
            text="Cancelar"
            another_color="bg-gray-100"
            another_text_color="text-black/40"
            another_size="h-11 sm:h-12 flex-1"
            another_text_size="text-sm sm:text-base"
          />

          <DefaultButton
            text={confirmText}
            another_color="bg-red-light"
            onClick={onConfirm}
            another_size="h-11 sm:h-12 flex-1"
            another_text_size="text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
