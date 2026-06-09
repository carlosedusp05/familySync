import { useState, useCallback, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { infoService } from "../services/infoService";

export function useInfoFamiliar() {
  const [members, setMembers] = useState([]);
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [allFamilyInfos, setAllFamilyInfos] = useState([]);
  const [infos, setInfos] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModeEdition, setIsModeEdition] = useState(false);
  const idFamilia = sessionStorage.getItem("@FamilySync:family:id");

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!idFamilia) {
        console.warn("ID da família não encontrado no sessionStorage");
        return;
      }

      const responseInfos = await infoService.getInfosByFamily(idFamilia);
      const payload = responseInfos.data?.dados || responseInfos.dados || {};
      const usuariosComInfos = payload.usuarios || [];

      const myUserId = String(decodedUser.id_usuario);
      const mappedMembers = usuariosComInfos.map((member) => ({
        ...member,
        isMe: String(member.id_usuario) === myUserId,
      }));

      const currentUser = mappedMembers.find((m) => m.isMe);
      const otherUsers = mappedMembers.filter((m) => !m.isMe);
      const sortedMembers = currentUser
        ? [currentUser, ...otherUsers]
        : mappedMembers;

      setMembers(sortedMembers);

      if (sortedMembers.length > 0) {
        const savedActiveId = sessionStorage.getItem(
          "@FamilySync:activeMemberId",
        );
        setActiveMemberId(
          (prevId) =>
            prevId ||
            (savedActiveId
              ? Number(savedActiveId)
              : sortedMembers[0].id_usuario),
        );
      }

      let allInfosFlattened = [];
      usuariosComInfos.forEach((usuario) => {
        const infosDoUsuario = usuario.informacoes || [];
        infosDoUsuario.forEach((info) => {
          allInfosFlattened.push({
            ...info,
            id_usuario: usuario.id_usuario,
            descricao: info.descricao_informacao || info.descricao,
          });
        });
      });

      setAllFamilyInfos(allInfosFlattened);
    } catch (error) {
      console.error("❌ Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [idFamilia, decodedUser.id_usuario]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!activeMemberId) return;

    const targetId =
      activeMemberId === "me" ? decodedUser.id_usuario : activeMemberId;

    const filteredInfos = allFamilyInfos.filter(
      (info) =>
        String(info.id_usuario) === String(targetId) ||
        String(info.id_usuario_informacao) === String(targetId),
    );

    setInfos(filteredInfos);
  }, [activeMemberId, allFamilyInfos, decodedUser.id_usuario]);

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

  const handleDelete = useCallback(async () => {
    if (!selectedInfo || !selectedInfo.id_usuario_informacao) return;

    const idParaDeletar = selectedInfo.id_usuario_informacao;

    handleCloseModal();

    setAllFamilyInfos((prev) =>
      prev.filter((info) => info.id_usuario_informacao !== idParaDeletar),
    );

    try {
      await infoService.deleteInfo(idParaDeletar);
    } catch (error) {
      console.log("Erro ignorado ao deletar:", error);
      fetchData();
    }
  }, [selectedInfo, handleCloseModal, fetchData]);

  const handleSave = useCallback(
    async (data) => {
      const { title, description } = data;
      setIsLoading(true);

      try {
        if (selectedInfo) {
          const infoAtualizada = {
            titulo: title,
            descricao: description,
          };
          await infoService.updateInfo(selectedInfo.id_info, infoAtualizada);
        } else {
          const newInfoPayload = {
            titulo: title,
            descricao: description,
          };

          const responseCreate = await infoService.createInfo(newInfoPayload);

          const infoCriada =
            responseCreate.dados || responseCreate.data || responseCreate;
          const idGerado = infoCriada?.Response?.id_info || infoCriada?.id_info;

          const targetId =
            activeMemberId === "me" ? decodedUser.id_usuario : activeMemberId;

          const payloadRelacionamento = {
            id_usuario: Number(targetId),
            id_familia: Number(idFamilia),
            id_info: Number(idGerado),
          };

          await infoService.createInfoWithUser(payloadRelacionamento);
        }
      } catch (error) {
        console.warn("Erro ignorado propositalmente:", error);
      } finally {
        await fetchData();
        handleCloseModal();
      }
    },
    [
      selectedInfo,
      activeMemberId,
      decodedUser.id_usuario,
      idFamilia,
      handleCloseModal,
      fetchData,
    ],
  );

  useEffect(() => {
    if (activeMemberId) {
      sessionStorage.setItem("@FamilySync:activeMemberId", activeMemberId);
    }
  }, [activeMemberId]);

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
