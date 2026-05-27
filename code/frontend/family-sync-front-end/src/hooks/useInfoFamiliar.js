import { useState, useCallback, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { infoService } from "../services/infoService";
import { userService } from "../services/userService";

const INITIAL_MOCK_INFOS = {};
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
  const [members, setMembers] = useState([]);
  const [activeMemberId, setActiveMemberId] = useState(null);

  const [allInfosDict, setAllInfosDict] = useState(getInitialInfosFromStorage);
  const [infos, setInfos] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);

  const decodedUser = useMemo(() => {
    let user = { nome: "Você", id_usuario: "me" };
    try {
      const token = Cookies.get("familysync_token");
      if (token) {
        user = jwtDecode(token);
      }
    } catch (error) {
      console.error("Erro ao decodificar token. Usando usuário padrão.", error);
    }
    return user;
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const idFamilia = sessionStorage.getItem("@FamilySync:family:id");
        if (!idFamilia) {
          console.warn("ID da família não encontrado no sessionStorage");
          return;
        }

        const response = await userService.listUsersByFamily(idFamilia);
        const fetchedMembers = response.dados.membros || [];

        const myUserId = String(decodedUser.id_usuario);
        const mappedMembers = fetchedMembers.map((member) => ({
          ...member,
          isMe: String(member.id_usuario) === myUserId,
        }));

        const sortedMembers = mappedMembers.sort((a, b) => {
          if (a.isMe) return -1;
          if (b.isMe) return 1;
          return 0;
        });

        setMembers(sortedMembers);

        if (sortedMembers.length > 0) {
          setActiveMemberId(sortedMembers[0].id_usuario);
        }
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [decodedUser.id_usuario]);

  useEffect(() => {
    if (!activeMemberId) return;

    const fetchInformacoes = async () => {
      try {
        const targetId =
          activeMemberId === "me" ? decodedUser.id_usuario : activeMemberId;
        const response = await infoService.getInfosById(targetId);

        const dados = response.data?.dados || response.data || [];
        setInfos(dados);
      } catch (error) {
        console.error("Erro ao buscar informações:", error);
        setInfos(allInfosDict[activeMemberId] || []);
      }
    };

    fetchInformacoes();
  }, [activeMemberId, decodedUser.id_usuario]);

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
    async (id_info) => {
      await infoService.deleteInfo(id_info);
      setAllInfosDict((prevDict) => {
        const currentMemberInfos = prevDict[activeMemberId] || [];
        return {
          ...prevDict,
          [activeMemberId]: currentMemberInfos.filter(
            (info) => info.id_info !== id_info,
          ),
        };
      });
    },
    [activeMemberId],
  );

  const handleSave = useCallback(
    async (data) => {
      const { title, description } = data;
      setIsLoading(true);

      try {
        if (selectedInfo) {
          const infoAtualizada = {
            id_info: selectedInfo.id_info,
            titulo: title,
            descricao: description,
          };
          await infoService.updateInfo(infoAtualizada);
          setInfos((prev) =>
            prev.map((info) =>
              info.id_info === selectedInfo.id_info
                ? { ...info, titulo: title, descricao: description }
                : info,
            ),
          );
        } else {
          const newInfoPayload = {
            titulo: title,
            descricao: description,
          };

          await infoService.createInfo(newInfoPayload);

          const responseAll = await infoService.getInfos();

          const listaInfos = responseAll.data?.dados || responseAll.dados || [];
          const ultimaInfo = listaInfos[listaInfos.length - 1];

          if (ultimaInfo) {
            const idGerado = ultimaInfo.id || ultimaInfo.id_info;

            await infoService.createInfoWithUser({
              id_info: idGerado,
              id_usuario: decodedUser.id_usuario,
            });

            setInfos((prev) => [ultimaInfo, ...prev]);
          }
        }

        handleCloseModal();
      } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar. Verifique o console para mais detalhes.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedInfo, handleCloseModal, decodedUser.id_usuario],
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
