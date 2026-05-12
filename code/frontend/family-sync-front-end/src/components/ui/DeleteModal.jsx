import { motion, AnimatePresence } from "framer-motion";
import DefaultButton from "../ui/DefaultButton";
import { deleteRedIcon } from "../../assets";

function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60"
        />
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-[30px] p-8 w-full max-w-md relative z-10 text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <img src={deleteRedIcon} className="w-10 h-10" alt="Alerta" />
          </div>
          <h2 className="text-[#4a2511] font-bold text-2xl mb-2">
            Excluir Conta
          </h2>
          <p className="text-gray-600 mb-8">
            Tem certeza? Esta ação é irreversível.
          </p>
          <div className="flex w-full gap-4">
            <DefaultButton text="Não, voltar" theme={false} onClick={onClose} />
            <DefaultButton
              text="Sim, excluir"
              theme={true}
              another_bg="bg-[#f03e3e]"
              onClick={onConfirm}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DeleteModal;
