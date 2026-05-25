import DefaultButton from "../../ui/DefaultButton";
import { trashIconRed } from "../../../assets";

function DeleteMemberModal({ isOpen, onClose, onConfirm, member }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl p-8 max-w-sm w-full shadow-xl flex flex-col gap-5 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
          <img src={trashIconRed} alt="Icone delete" className="h-9 w-9" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Remover Membro?</h2>
          <p className="text-gray-500 text-sm mt-2">
            Tem certeza que deseja remover <strong>{member?.name}</strong> da
            família? Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex gap-3 mt-2">
          <DefaultButton
            onClick={onClose}
            text="Cancelar"
            another_color={"bg-gray-100"}
            another_text_color={"text-black/40"}
            another_size={"h-14 w-40"}
          />

          <DefaultButton
            text="Sim, Remover"
            another_color={"bg-red-light"}
            onClick={onConfirm}
            another_size={"h-14 w-40"}
          />
        </div>
      </div>
    </div>
  );
}

export default DeleteMemberModal;
