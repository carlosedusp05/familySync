import { useState } from "react";
import { closeTagIcon } from "../../assets";

import DefaultButton from "./DefaultButton";

function ModalAddInfo({ isOpen, onClose }) {
  const [participants, setParticipants] = useState([]);
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleAddParticipant = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();

      if (!participants.includes(inputValue.trim())) {
        setParticipants([...participants, inputValue.trim()]);
      }

      // Limpa o campo de input
      setInputValue("");
    }
  };

  const handleRemoveParticipant = (participantToRemove) => {
    setParticipants(participants.filter((p) => p !== participantToRemove));
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#FEF6E4] w-full max-w-2xl p-8 rounded-[40px] shadow-2xl border border-white/20 flex flex-col gap-6 animate-scale-up">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#5D2A11] text-3xl font-bold">
            Nova Informação Familiar
          </h2>
          <p className="text-[#5D2A11]/60">
            Preencha os detalhes da nova alergia ou condição médica.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Campo de Título da Alergia */}
          <input
            type="text"
            placeholder="Título (ex: Alergia a Glúten severa)"
            className="w-full p-4 rounded-2xl border border-[#5D2A11]/10 bg-white/50 outline-none focus:border-orange-dark transition-colors placeholder:text-[#5D2A11]/40"
          />

          {/* Área de Entrada de Participantes (o Input E as Tags) */}
          <div className="flex flex-col gap-2">
            <label className="text-[#5D2A11] text-sm font-semibold px-1">
              Participantes (Pressione Enter para adicionar)
            </label>

            {/* Container que imita o input, segurando as tags e o campo de texto real */}
            <div className="w-full min-h-[56px] p-2 flex flex-wrap gap-2 rounded-2xl border border-[#5D2A11]/10 bg-white/50 focus-within:border-orange-dark transition-colors">
              {/* Mapeamento e renderização das tags de participantes */}
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 bg-orange text-white text-sm font-medium px-3 py-1.5 rounded-full animate-fade-in"
                >
                  {participant}
                  <img
                    src={closeTagIcon}
                    alt="Remover"
                    className="w-3.5 h-3.5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveParticipant(participant)} // Remove a tag
                  />
                </div>
              ))}

              {/* O campo de input real, que fica invisível dentro do container maior */}
              <input
                type="text"
                value={inputValue} // Ligado ao estado do texto digitado
                onChange={(e) => setInputValue(e.target.value)} // Atualiza o estado ao digitar
                onKeyDown={handleAddParticipant} // Escuta a tecla pressionada (Enter)
                placeholder={
                  participants.length === 0 ? "Nome do membro..." : ""
                } // Mostra placeholder apenas se não houver tags
                className="flex-1 min-w-[120px] p-2 bg-transparent outline-none text-[#5D2A11] placeholder:text-[#5D2A11]/40"
              />
            </div>
          </div>

          {/* Campo de Descrição Detalhada */}
          <textarea
            placeholder="Descrição detalhada sobre sintomas, precauções e tratamento emergencial..."
            rows="5"
            className="w-full p-4 rounded-2xl border border-[#5D2A11]/10 bg-white/50 outline-none focus:border-orange-dark transition-colors resize-none placeholder:text-[#5D2A11]/40"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl bg-zinc-300 text-zinc-700 font-bold hover:bg-zinc-400 transition-colors"
          >
            CANCELAR
          </button>
          <button
            onClick={() => {
              // Aqui você enviaria os dados (Título, participants array, descrição) para sua API
              console.log("Salvar:", { participants });
              alert("Informação salva com sucesso!");
              onClose(); // Fecha o modal
              // Opcional: Limpar os estados do form aqui se o modal for reutilizado
            }}
            className="flex-1 px-6 py-3 rounded-2xl bg-orange-dark text-white font-bold hover:brightness-110 transition-all shadow-lg"
          >
            SALVAR INFORMAÇÃO
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAddInfo;
