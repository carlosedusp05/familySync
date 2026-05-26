import DefaultButton from "../../ui/DefaultButton";
import {
  trashIconRed,
  eyeMostOrange,
  settingsIcon,
  settingsOrange,
  eyeWhite,
} from "../../../assets";

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
}) {
  return (
    <div className="flex-1 bg-white rounded-[40px] shadow-sm p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">
          Membros ({familiars.length})
        </h1>
      </div>

      <div className="bg-[#fdf8ed] rounded-2xl p-5 flex flex-col gap-3 border border-orange/20">
        <span className="font-bold text-gray-800">Convidar Novo Membro</span>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Digite e-mail ou nome de usuário..."
            className="flex-1 h-12 bg-white rounded-xl border border-gray-200 px-4 text-gray-700 outline-none focus:border-orange"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
          <DefaultButton
            text="Enviar Convite"
            another_size="w-auto px-6 h-12"
            another_padding="py-0"
            onClick={handleAddMember}
          />
        </div>
      </div>

      <div
        className="flex flex-col gap-4 overflow-y-auto pr-2 pb-24 custom-scrollbar  [&::-webkit-scrollbar]:w-2.5
            [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[#282828]
            [&::-webkit-scrollbar-thumb]:rounded-md"
      >
        {familiars.map((member) => (
          <div
            key={member.id}
            className={`flex items-center justify-between p-4 rounded-2xl border ${
              member.isMe
                ? "bg-orange/10 border-orange/30"
                : "bg-white border-gray-100"
            } relative shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${member.name}&background=random`}
                  alt={member.name}
                />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-800">
                  {member.name} {member.isMe && "(Você)"}
                </p>
                <p className="text-sm text-gray-500">
                  {member.degree_of_relatives}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {member.isMe && (
                <span className="bg-orange/20 text-orange px-3 py-1 rounded-lg text-sm font-bold">
                  Você
                </span>
              )}

              <button
                onClick={() => toggleMenu(member.id)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-xl font-bold leading-none pb-2">...</span>
              </button>

              {activeMenuId === member.id && (
                <div className="absolute right-5 top-14 bg-white border border-gray-200 shadow-lg rounded-xl p-2 w-56 z-10 flex flex-col gap-1">
                  <button
                    className="flex items-center gap-3 px-4 py-3 hover:bg-orange/90 hover:text-white rounded-lg text-left text-sm text-orange font-semibold transition-colors"
                    onMouseEnter={() => setIsHoveredSettings(true)}
                    onMouseLeave={() => setIsHoveredSettings(false)}
                    onClick={() => openPermissionsModal(member)}
                  >
                    <img
                      src={isHoveredSettings ? settingsIcon : settingsOrange}
                      alt="Gerenciar Permissões"
                      className="h-6 w-6"
                    />
                    <h1>Gerenciar Permissões</h1>
                  </button>
                  {!member.isMe && (
                    <button
                      onClick={() => openDeleteModal(member)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-light/60 hover:text-white rounded-lg text-left text-red-600 text-sm font-semibold transition-colors"
                    >
                      <img
                        src={trashIconRed}
                        alt="Delete Membro"
                        className="h-6 w-6"
                      />
                      <h1>Remover Membro</h1>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MembersList;
