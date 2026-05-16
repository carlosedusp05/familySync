import { useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const MOCK_MEMBERS = [
  { id: "me", name: "VOCÊ", role: "USER" },
  { id: "1", name: "Kauan Silva", role: "FAMILY" },
  { id: "2", name: "Ana Souza", role: "FAMILY" },
  { id: "3", name: "Bruno Oliveira", role: "FAMILY" },
];

const INITIAL_MOCK_INFOS = {
  me: [
    {
      id_info: 101,
      titulo: "Alergia a Amendoim",
      descricao: "Reação alérgica severa, manter epinefrina por perto.",
      creator: "Adicionado por: Você",
    },
  ],
  1: [
    {
      id_info: 102,
      titulo: "Tipo Sanguíneo",
      descricao: "A Positivo",
      creator: "Adicionado por: Você",
    },
  ],
  2: [
    {
      id_info: 103, // Baseado no print 4 da sua API
      titulo: "Divisão de tarefas domésticas",
      descricao: "Asma: Usa bombinha em caso de crise (Salbutamol).",
      creator: "Adicionado por: Você",
    },
  ],
  3: [],
};

const STORAGE_KEY = "@FamilySync:infos";

const getInitialInfosFromStorage = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Erro ao ler do localStorage", error);
  }
  return INITIAL_MOCK_INFOS;
};

export function useInfoFamiliar() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [activeMemberId, setActiveMemberId] = useState(
    MOCK_MEMBERS[0]?.id || null,
  );

  const [allInfosDict, setAllInfosDict] = useState(getInitialInfosFromStorage);
  const [infos, setInfos] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);

  let decodedUser = { nome: "Você", id_usuario: "me" };
  try {
    const token = Cookies.get("familysync_token");
    if (token) {
      decodedUser = jwtDecode(token);
    }
  } catch (error) {
    console.error("Erro ao decodificar token. Usando usuário padrão.", error);
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allInfosDict));
  }, [allInfosDict]);

  useEffect(() => {
    if (!activeMemberId) return;

    const fetchInformacoes = async () => {
      setIsLoading(true);
      try {
        // --- AQUI ENTRARÁ O GET ---
        // Exemplo:
        // const targetId = activeMemberId === "me" ? decodedUser.id_usuario : activeMemberId;
        // const response = await api.get(`/v1/familysync/usuario-informacao/${targetId}`);
        // setInfos(response.data.dados);

        // --- Lógica Mock atual ---
        setInfos(allInfosDict[activeMemberId] || []);
      } catch (error) {
        console.error("Erro ao buscar informações do membro", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInformacoes();
  }, [activeMemberId, allInfosDict]);

  const handleOpenModal = useCallback((item = null, isEditMode = true) => {
    setSelectedInfo(item);
    setIsModeEdition(isEditMode);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedInfo(null);
      setIsModeEdition(false);
    }, 200);
  }, []);

  const handleDelete = useCallback(
    (id_info) => {
      // aqui terá um await api.delete(`/v1/familysync/informacoes/${id_info}`)
      setAllInfosDict((prevDict) => {
        const currentMemberInfos = prevDict[activeMemberId] || [];
        return {
          ...prevDict,
          // Usando a chave correta: id_info
          [activeMemberId]: currentMemberInfos.filter(
            (info) => info.id_info !== id_info,
          ),
        };
      });
    },
    [activeMemberId],
  );

  const handleSave = useCallback(
    (data) => {
      // data vem do form (provavelmente do react-hook-form)
      const { title, description } = data;

      setAllInfosDict((prevDict) => {
        const currentMemberInfos = prevDict[activeMemberId] || [];
        let updatedMemberInfos;

        if (selectedInfo) {
          // Editando (No futuro: PUT /v1/familysync/informacoes/:id_info)
          updatedMemberInfos = currentMemberInfos.map((info) =>
            info.id_info === selectedInfo.id_info
              ? { ...info, titulo: title, descricao: description } // Mapeando para o padrão da API
              : info,
          );
        } else {
          // Criando (No futuro: POST /v1/familysync/informacoes/)
          const newInfo = {
            id_info: Date.now(),
            id_usuario: decodedUser.id_usuario,
            titulo: title,
            descricao: description,
          };
          updatedMemberInfos = [newInfo, ...currentMemberInfos];
        }

        return {
          ...prevDict,
          [activeMemberId]: updatedMemberInfos,
        };
      });

      handleCloseModal();
    },
    [
      selectedInfo,
      activeMemberId,
      handleCloseModal,
      decodedUser.nome,
      decodedUser.id_usuario,
    ],
  );

  return {
    members,
    activeMemberId,
    setActiveMemberId,
    infos,
    isLoading,
    isModalOpen,
    selectedInfo,
    isModeEdition,
    handleCloseModal,
    handleOpenModal,
    handleDelete,
    handleSave,
  };
}
