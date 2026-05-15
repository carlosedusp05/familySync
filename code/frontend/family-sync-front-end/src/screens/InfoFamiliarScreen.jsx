import { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import MultInfos from "../components/ui/MultInfos";
import ModalInfo from "../components/ui/ModalInfo";
import { userService } from "../services/userService";
import { infoService } from "../services/infoService";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
      const savedMembers = Cookies.get("familia_data");
      return savedMembers ? JSON.parse(savedMembers) : DEFAULT_MEMBERS;
    }
    return DEFAULT_MEMBERS;
  });

  const [activeMemberId, setActiveMemberId] = useState("me");
  const [infos, setInfos] = useState([]);
  const [loggedUserId, setLoggedUserId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);

  useEffect(() => {
    const fetchInfos = async () => {
      try {
        const token = Cookies.get("@FamilySync:token");
        if (token) {
          const decoded = jwtDecode(token);
          setLoggedUserId(decoded.id_usuario);

          // Define de quem vamos buscar as infos (logado ou membro da familia)
          const targetUserId =
            activeMemberId === "me" ? decoded.id_usuario : activeMemberId;

          // Busca da API
          const response = await userService.getUserInfoById(targetUserId);

          if (response && response.length > 0) {
            setInfos(response);
            // Atualiza o cache do cookie com os dados mais recentes da API
            Cookies.set(`infos_${activeMemberId}`, JSON.stringify(response), {
              expires: 7,
            });
          } else {
            // Se a API não retornar nada, tenta usar o que está no Cookie
            const savedinfos = Cookies.get(`infos_${activeMemberId}`);
            setInfos(savedinfos ? JSON.parse(savedinfos) : []);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados ou token:", error);
        // Fallback para os cookies em caso de erro na rede
        const savedinfos = Cookies.get(`infos_${activeMemberId}`);
        setInfos(savedinfos ? JSON.parse(savedinfos) : []);
      }
    };

    fetchInfos();
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
    async (id) => {
      try {
        // Chamada da API para deletar
        await infoService.deleteInfo(id);

        setInfos((prev) => {
          const updatedList = prev.filter((item) => item.id !== id);
          Cookies.set(`infos_${activeMemberId}`, JSON.stringify(updatedList), {
            expires: 7,
          });
          return updatedList;
        });
      } catch (error) {
        console.error("Erro ao deletar informação:", error);
      }
    },
    [activeMemberId],
  );

  const handleSave = useCallback(
    async (newData) => {
      try {
        let savedData;
        const targetUserId =
          activeMemberId === "me" ? loggedUserId : activeMemberId;

        if (selectedInfo) {
          // Edição
          const payload = {
            titulo: newData.title,
            descricao: newData.description,
          };
          await infoService.updateInfo(selectedInfo.id, payload);

          savedData = {
            ...selectedInfo,
            title: newData.title,
            desc: newData.description,
          };

          setInfos((prev) => {
            const updatedList = prev.map((item) =>
              item.id === selectedInfo.id ? savedData : item,
            );
            Cookies.set(
              `infos_${activeMemberId}`,
              JSON.stringify(updatedList),
              { expires: 7 },
            );
            return updatedList;
          });
        } else {
          const infoData = {
            titulo: newData.title,
            descricao: newData.description,
          };
          const createInfo = await infoService.createInfo(infoData);

          console.log(infoData);

          const allInfos = await infoService.getInfos();
          const lastInfo = allInfos[allInfos.length - 1];

          console.log(lastInfo);

          const payload = {
            id_informacao: lastInfo.id,
            id_usuario: targetUserId,
          };

          console.log(payload);
          await userService.AddUserInfo(payload);

          savedData = {
            id: lastInfo.id,
            title: newData.title,
            desc: newData.description,
          };

          setInfos((prev) => {
            const updatedList = [savedData, ...prev];
            Cookies.set(
              `infos_${activeMemberId}`,
              JSON.stringify(updatedList),
              { expires: 7 },
            );
            return updatedList;
          });
        }

        handleCloseModal();
      } catch (error) {
        console.error("Erro ao salvar informação:", error);
      }
    },
    [activeMemberId, selectedInfo, handleCloseModal, loggedUserId],
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
            {infos.length > 0 ? (
              <div className="w-full h-full overflow-y-auto pt-24 pr-2">
                <MultInfos
                  infos={infos}
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
