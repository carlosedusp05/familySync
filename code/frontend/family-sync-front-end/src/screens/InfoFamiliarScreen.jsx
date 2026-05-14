import { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import MultAllergys from "../components/ui/MultAllergy";
import ModalInfo from "../components/ui/ModalInfo";
const DEFAULT_MEMBERS = [
  { id: "me", name: "VOCÊ", role: "USER" },
  { id: "1", name: "Kauan Silva", role: "FAMILY" },
  { id: "2", name: "Ana Souza", role: "FAMILY" },
  { id: "3", name: "Bruno Oliveira", role: "FAMILY" },
  { id: "4", name: "Mariana Santos", role: "FAMILY" },
  { id: "5", name: "Lucas Lima", role: "FAMILY" },
];

function InfoFamiliarScreen() {
  const [members, setMembers] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMembers = localStorage.getItem("familia_data");
      return savedMembers ? JSON.parse(savedMembers) : DEFAULT_MEMBERS;
    }
    return DEFAULT_MEMBERS;
  });

  const [activeMemberId, setActiveMemberId] = useState("me");
  const [allergies, setAllergies] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedAllergies = localStorage.getItem(
        `allergies_${activeMemberId}`,
      );
      setAllergies(savedAllergies ? JSON.parse(savedAllergies) : []);
    }, 350);

    return () => clearTimeout(timer);
  }, [activeMemberId]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedInfo(null);
  }, []);

  const handleOpenModal = useCallback((info = null, forceEdit = false) => {
    setSelectedInfo(info);
    setIsModeEdition(forceEdit);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      setAllergies((prev) => {
        const updatedList = prev.filter((item) => item.id !== id);
        localStorage.setItem(
          `allergies_${activeMemberId}`,
          JSON.stringify(updatedList),
        );
        return updatedList;
      });
    },
    [activeMemberId],
  );

  const handleSave = useCallback(
    (newData) => {
      setAllergies((prev) => {
        let updatedList;
        if (selectedInfo) {
          updatedList = prev.map((item) =>
            item.id === selectedInfo.id
              ? { ...item, title: newData.title, desc: newData.description }
              : item,
          );
        } else {
          updatedList = [
            { id: Date.now(), title: newData.title, desc: newData.description },
            ...prev,
          ];
        }
        localStorage.setItem(
          `allergies_${activeMemberId}`,
          JSON.stringify(updatedList),
        );
        return updatedList;
      });
      handleCloseModal();
    },
    [activeMemberId, selectedInfo, handleCloseModal],
  );

  const renderedMembers = useMemo(() => {
    return members.map((member) => {
      const isActive = activeMemberId === member.id;
      return (
        <div
          key={member.id}
          onClick={() => setActiveMemberId(member.id)}
          className="flex flex-col items-center gap-1 w-full group cursor-pointer"
        >
          <div
            className={`rounded-full h-24 w-24 flex items-center justify-center shadow-md transition-[transform,background-color,border-color] border-4 duration-300 ease-out will-change-transform
            ${
              isActive
                ? "bg-brown-dark border-brown-dark scale-105"
                : "bg-yellow-cream border-yellow-cream hover:scale-105 active:scale-95"
            }`}
          />
          <span
            className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300
            ${isActive ? "text-[#5D2A11]" : "text-[#5D2A11]/60"}`}
          >
            {member.name}
          </span>
        </div>
      );
    });
  }, [members, activeMemberId]);

  return (
    <MainLayout>
      <div className="flex flex-row gap-4 items-center justify-center py-12 h-full">
        <div className="h-full w-[60%] bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-3xl p-8 overflow-hidden flex flex-col relative transform-gpu">
          <div className="w-full p-5 flex justify-end absolute top-3 right-3 z-10">
            <DefaultButton
              text="Adicionar informação familiar"
              another_size="h-15 w-100"
              another_text_size="text-2xl"
              another_text_weight="font-normal"
              another_color="bg-orange-dark"
              onClick={() => handleOpenModal(null, true)}
            />
          </div>

          <div className="flex-1 flex items-center justify-center">
            {allergies.length > 0 ? (
              <div className="w-full h-full overflow-y-auto pt-24 pr-2">
                <MultAllergys
                  allergys={allergies}
                  onEditItem={(item) => handleOpenModal(item, false)}
                  onEditClick={(item) => handleOpenModal(item, true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-6 animate-fade-in -mt-10">
                <div className="opacity-20 flex justify-center items-center">
                  <svg
                    className="w-32 h-32 text-white"
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
                  <h3 className="text-white/80 text-2xl font-semibold">
                    Nenhuma informação registrada
                  </h3>
                  <p className="text-white/40 max-w-87.5 mx-auto text-lg leading-relaxed">
                    Sua lista está vazia. Clique no botão acima para adicionar
                    detalhes importantes sobre a saúde da família.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-70 h-full bg-[#EED9CE]/40 backdrop-blur-lg border border-white/10 p-6 flex flex-col items-center gap-6 shadow-[-10px_0_30px_0_rgba(0,0,0,0.1)] rounded-[40px] transform-gpu">
          <div className="flex flex-col items-center gap-6 w-full">
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
    </MainLayout>
  );
}

export default InfoFamiliarScreen;
