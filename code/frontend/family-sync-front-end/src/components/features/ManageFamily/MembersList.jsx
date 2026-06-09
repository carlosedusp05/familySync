import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import DefaultButton from "../../ui/DefaultButton";
import { trashIconRed, settingsIcon, settingsOrange } from "../../../assets";

function MembersList({
  familiars,
  activeMenuId,
  toggleMenu,
  isHoveredSettings,
  setIsHoveredSettings,
  isHoveredView,
  setIsHoveredView,
  openPermissionsModal,
  openDeleteModal,
  currentEmail,
  setCurrentEmail,
  handleAddMember,
  isCurrentUserAdmin, // Recebido diretamente do useManageFamily
}) {
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  const handleMenuClick = (e, memberId) => {
    e.stopPropagation();
    if (activeMenuId === memberId) {
      toggleMenu(memberId);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        right: document.documentElement.clientWidth - rect.right,
      });
      toggleMenu(memberId);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuId) toggleMenu(activeMenuId);
    };
    const handleScroll = () => {
      if (activeMenuId) toggleMenu(activeMenuId);
    };

    if (activeMenuId) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [activeMenuId, toggleMenu]);

  return (
    <div className="flex-1 bg-white rounded-[2rem] shadow-sm p-5 sm:p-7 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-black">
          Membros ({familiars?.length || 0})
        </h1>
      </div>

      {/* A caixa de convites volta a estar visível para todos os utilizadores */}
      <div className="bg-[#fdf8ed] rounded-xl p-4 flex flex-col gap-3 border border-orange/20 shadow-sm">
        <span className="font-bold text-gray-800 text-sm sm:text-base">
          Convidar Novo Membro
        </span>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch">
          <input
            type="text"
            placeholder="E-mail ou utilizador..."
            className="w-full sm:flex-1 min-h-[44px] py-2 px-4 bg-white rounded-xl border border-gray-300 text-sm sm:text-base text-gray-800 outline-none focus:border-orange focus:ring-1 focus:ring-orange/50 transition-all"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
          <DefaultButton
            text="Enviar Convite"
            another_size="w-full sm:w-auto px-6 min-h-[44px]"
            another_padding="py-2"
            another_text_size="text-sm font-bold"
            onClick={handleAddMember}
          />
        </div>
      </div>

      <div
        className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar [&::-webkit-scrollbar]:w-2.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[#282828]
          [&::-webkit-scrollbar-thumb]:rounded-md"
      >
        {familiars.map((member) => (
          <div
            key={member.id}
            className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border ${
              member.isMe
                ? "bg-orange/10 border-orange/30"
                : "bg-white border-gray-100"
            } relative shadow-sm`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                <img
                  src={
                    member.foto
                      ? member.foto
                      : `https://ui-avatars.com/api/?name=${member.name}&background=random`
                  }
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=random`;
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm sm:text-base text-gray-800">
                    {member.name}
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  {member.degree_of_relatives}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* TAGS DE IDENTIFICAÇÃO VISUAL */}
              {member.isAdmin && (
                <span className="inline-block bg-[#662700]/10 text-[#662700] px-2 py-0.5 rounded-md text-xs font-bold border border-[#662700]/20">
                  Admin
                </span>
              )}

              {member.isMe && (
                <span className="inline-block bg-orange/20 text-orange px-2 py-0.5 rounded-md text-xs font-bold">
                  Você
                </span>
              )}

              {/* SÓ MOSTRA O MENU DE EDIÇÃO SE QUEM ESTIVER A VER FOR ADMIN E NÃO FOR O SEU PRÓPRIO CARD */}
              {isCurrentUserAdmin && !member.isMe && (
                <button
                  onClick={(e) => handleMenuClick(e, member.id)}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold leading-none pb-1.5">
                    ...
                  </span>
                </button>
              )}

              {activeMenuId === member.id &&
                createPortal(
                  <div
                    className="fixed bg-white border border-gray-200 shadow-lg rounded-xl p-1.5 w-44 sm:w-48 z-[9999] flex flex-col gap-1"
                    style={{ top: menuPos.top, right: menuPos.right }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="flex items-center gap-2 px-3 py-2 hover:bg-orange/90 hover:text-white rounded-lg text-left text-xs text-orange font-semibold transition-colors"
                      onMouseEnter={() => setIsHoveredSettings(true)}
                      onMouseLeave={() => setIsHoveredSettings(false)}
                      onClick={() => {
                        openPermissionsModal(member);
                        toggleMenu(member.id);
                      }}
                    >
                      <img
                        src={isHoveredSettings ? settingsIcon : settingsOrange}
                        alt="Gerir Permissões"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <h1>Gerenciar Permissões</h1>
                    </button>

                    <button
                      onClick={() => {
                        openDeleteModal(member);
                        toggleMenu(member.id);
                      }}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-red-light/60 hover:text-white rounded-lg text-left text-red-600 text-xs font-semibold transition-colors"
                    >
                      <img
                        src={trashIconRed}
                        alt="Apagar Membro"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <h1>Remover Membro</h1>
                    </button>
                  </div>,
                  document.body,
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersList;
