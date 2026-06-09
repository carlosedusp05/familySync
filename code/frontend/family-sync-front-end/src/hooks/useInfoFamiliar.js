import { useState, useCallback, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { infoService } from "../services/infoService";
import { familyService } from "../services/familyService";

export function useInfoFamiliar() {
  const [members, setMembers] = useState([]);
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [allFamilyInfos, setAllFamilyInfos] = useState([]);
  const [infos, setInfos] = useState([]);
  const [userinfo, setUserInfo] = useState("");

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

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        if (!idFamilia) {
          console.warn("ID da família não encontrado no sessionStorage");
          return;
        }

        const responseMembers =
          await familyService.getFamilyComplete(idFamilia);

        const fetchedMembers = responseMembers.Response?.usuarios || [];
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

        const responseInfos = await infoService.getInfosByFamily(idFamilia);

        const payload = responseInfos.data?.dados || responseInfos.dados || {};
        const usuariosComInfos = payload.usuarios || [];

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
        console.error("Erro ao buscar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [decodedUser.id_usuario]);

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
    if (!selectedInfo || !selectedInfo.id_usuario_informacao) {
      console.warn("Nenhuma informação selecionada para deletar.");
      return;
    }

    try {
      await infoService.deleteInfo(selectedInfo.id_usuario_informacao);

      setAllFamilyInfos((prevInfos) =>
        prevInfos.filter(
          (info) => info.id_usuario_informacao !== id_usuario_informacao,
        ),
      );

      handleCloseModal();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }, [selectedInfo, handleCloseModal, activeMemberId]);

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

          setAllFamilyInfos((prev) =>
            prev.map((info) =>
              info.id_info === selectedInfo.id_info
                ? { ...info, titulo: title, descricao: description }
                : info,
            ),
          );
        } else {
          const newInfoPayload = {
            id_familia: idFamilia ? Number(idFamilia) : null,
            id_usuario: decodedUser.id_usuario
              ? Number(decodedUser.id_usuario)
              : null,
            titulo: title,
            descricao: description,
          };

          const responseCreate = await infoService.createInfo(newInfoPayload);

          const infoCriada =
            responseCreate.dados || responseCreate.data || responseCreate;
          const idGerado = infoCriada.Response.id_info;

          if (!idGerado) {
            throw new Error(
              "Não foi possível recuperar o ID da informação recém-criada.",
            );
          }

          const targetId =
            activeMemberId === "me" ? decodedUser.id_usuario : activeMemberId;

          const novaInfoNormalizada = {
            ...infoCriada,
            titulo: title,
            descricao: description,
            id_usuario: targetId,
            id_usuario_informacao: idGerado,
          };

          setAllFamilyInfos((prev) => [novaInfoNormalizada, ...prev]);
        }

        handleCloseModal();
      } catch (error) {
        console.error("Erro geral ao salvar/criar a informação:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedInfo, handleCloseModal, activeMemberId, decodedUser.id_usuario],
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
