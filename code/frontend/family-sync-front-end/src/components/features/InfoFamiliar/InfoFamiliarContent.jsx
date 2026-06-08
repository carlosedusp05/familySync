import { useMemo } from "react";
import DefaultButton from "../../ui/DefaultButton.jsx";
import MultInfos from "./MultInfos.jsx";
import ModalInfo from "./ModalInfo.jsx";
import LoadingOverlay from "../../ui/LoadingOverlay.jsx";
import MemberSelector from "./MemberSelector.jsx";

function InfoFamiliarContent({
  members,
  activeMemberId,
  setActiveMemberId,
  infos,
  isModalOpen,
  selectedInfo,
  isModeEdition,
  handleCloseModal,
  handleOpenModal,
  handleDelete,
  handleSave,
  isLoading,
}) {
  const renderedMembers = useMemo(() => {
    return members.map((member) => {
      const id = member.id_usuario;
      const nome = member.nome || member.nome_usuario;
      const isActive = activeMemberId === id;

      const foto = member.foto_perfil || member.foto || member.avatar || null;

      return (
        <div
          key={id}
          onClick={() => setActiveMemberId(id)}
          className="flex flex-col items-center gap-1 w-auto lg:w-full group cursor-pointer shrink-0"
        >
          <div
            className={`rounded-full h-16 w-16 md:h-20 md:w-20 lg:h-15 lg:w-15 2xl:h-18 2xl:w-18 flex items-center justify-center transition-all shadow-md overflow-hidden shrink-0 border-4
          ${isActive ? "border-brown-dark scale-105" : "border-transparent hover:scale-105"}`}
          >
            <img
              src={
                foto
                  ? foto
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      nome,
                    )}&background=random`
              }
              alt={nome}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  nome,
                )}&background=random`;
              }}
            />
          </div>
          <span
            className={`text-[10px] md:text-xs xl:text-[9px] font-bold uppercase text-center mt-1 ${
              isActive ? "text-brown-dark" : "text-yellow-cream"
            }`}
          >
            {nome}
          </span>
        </div>
      );
    });
  }, [members, activeMemberId, setActiveMemberId]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="fixed lg:relative inset-x-0 top-16 bottom-24 lg:top-0 lg:bottom-0 flex flex-col lg:flex-row gap-4 items-center justify-center p-4 lg:py-12 lg:px-8 h-auto lg:h-full w-full overscroll-none overflow-hidden">
        <div className="w-full block lg:hidden h-14 relative z-[110] shrink-0 touch-none">
          <div className="absolute top-0 left-0 w-full z-[110]">
            <MemberSelector
              members={members}
              activeMemberId={activeMemberId}
              setActiveMemberId={setActiveMemberId}
            />
          </div>
        </div>

        {/* Card de Conteúdo Principal */}
        <div className="flex-1 lg:flex-none lg:h-full w-full lg:w-[60%] bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-[2rem] p-4 md:p-8 overflow-hidden flex flex-col relative transform-gpu z-10 min-h-0 mt-2 lg:mt-0">
          <div className="w-full pb-4 lg:pb-0 lg:p-5 flex justify-center lg:justify-end relative lg:absolute top-0 lg:top-3 right-0 lg:right-3 z-10">
            <DefaultButton
              text="Adicionar informação familiar"
              another_size="h-10 lg:h-12 w-fit px-6 2xl:px-12 2xl:py-8"
              another_text_size="text-sm md:text-base 2xl:text-[24px]"
              another_text_weight="font-normal"
              another_color="bg-orange-dark"
              onClick={() => handleOpenModal(null, true)}
            />
          </div>

          <div className="flex-1 flex items-center justify-center min-h-0 w-full mt-2 lg:mt-0">
            {infos.length > 0 ? (
              <div className="w-full h-full lg:pt-24 pt-4 flex flex-col min-h-0">
                <MultInfos
                  infos={infos}
                  onEditItem={(item) => handleOpenModal(item, false)}
                  onEditClick={(item) => handleOpenModal(item, true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4 lg:gap-6 animate-fade-in lg:-mt-10 p-4">
                <div className="opacity-20 flex justify-center items-center">
                  <svg
                    className="w-20 h-20 md:w-32 md:h-32 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-white/80 text-xl md:text-2xl font-semibold">
                    Nenhuma informação registrada
                  </h3>
                  <p className="text-white/40 max-w-[80%] mx-auto text-sm md:text-lg leading-relaxed">
                    Sua lista está vazia. Clique no botão acima para adicionar
                    detalhes importantes sobre a saúde da família.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Lateral (Desktop) */}
        <div className="hidden lg:flex w-full lg:w-50 2xl:w-60 h-auto lg:h-full bg-[#EED9CE]/40 backdrop-blur-lg border border-white/10 p-4 lg:p-6 flex-col items-center gap-4 shadow-[-10px_0_30px_0_rgba(0,0,0,0.1)] rounded-[2rem] lg:rounded-[40px] transform-gpu min-h-0">
          <div
            className="flex flex-col items-center gap-6 w-full overflow-y-auto custom-scrollbar 
            [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:h-2.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#282828]
            [&::-webkit-scrollbar-thumb]:rounded-md pb-2 lg:pb-0 pt-2 min-h-0"
          >
            {renderedMembers}
          </div>
        </div>
      </div>

      <ModalInfo
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={selectedInfo}
        onDelete={handleDelete}
        onSave={handleSave}
        isInitialEdit={isModeEdition}
      />
    </>
  );
}

export default InfoFamiliarContent;
