import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chevronDownBrownIcon } from "../../../assets";

function MemberSelector({ members, activeMemberId, setActiveMemberId }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const activeMember =
    members.find((m) => String(m.id_usuario) === String(activeMemberId)) ||
    members[0];

  return (
    <div className="relative w-full max-w-[90%] mx-auto mb-4 z-50">
      <div
        className="bg-white rounded-full flex justify-between items-center px-5 py-2.5 shadow-md cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-3">
          {activeMember?.foto ? (
            <img
              src={activeMember.foto}
              alt={activeMember.nome}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#4a2511] flex items-center justify-center text-white font-bold text-sm">
              {activeMember?.nome?.charAt(0).toUpperCase()}
            </div>
          )}

          <span className="text-[#4a2511] font-bold text-lg truncate max-w-[150px]">
            {activeMember?.nome || "Selecione..."}
          </span>
        </div>

        <motion.img
          src={chevronDownBrownIcon}
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-6 h-6 object-contain"
          alt="Expandir"
        />
      </div>

      {/* Dropdown com Altura Máxima Dinâmica Corrigida */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-y-auto max-h-[calc(100vh-290px)] custom-scrollbar
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#282828]
            [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {members.map((member) => (
              <div
                key={member.id_usuario}
                className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors shrink-0 ${
                  String(activeMemberId) === String(member.id_usuario)
                    ? "bg-orange/10 border-l-4 border-orange"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
                onClick={() => {
                  setActiveMemberId(member.id_usuario);
                  setIsOpen(false);
                }}
              >
                {member.foto ? (
                  <img
                    src={member.foto}
                    alt={member.nome}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#4a2511] opacity-90 flex items-center justify-center text-white font-bold text-sm">
                    {member.nome?.charAt(0).toUpperCase()}
                  </div>
                )}

                <span
                  className={`text-base ${
                    String(activeMemberId) === String(member.id_usuario)
                      ? "text-orange font-bold"
                      : "text-[#4a2511] font-medium"
                  }`}
                >
                  {member.nome} {member.isMe ? "(Eu)" : ""}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MemberSelector;
