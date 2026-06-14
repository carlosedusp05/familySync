import { useRef, useState, useEffect, useMemo } from "react";
import { familyService } from "../services/familyService";
import { permissaoService } from "../services/permissaoService";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { validateEmail } from "../utils/validators";

const INITIAL_FAMILIARS = [
  {
    id: 3,
    name: "Lucas Gabriel",
    degree_of_relatives: "Filho",
    isMe: false,
    isAdmin: false,
  },
  {
    id: 1,
    name: "João Pedro Silva",
    degree_of_relatives: "Pai",
    isMe: false,
    isAdmin: true,
  },
  {
    id: 2,
    name: "Maria Alice",
    degree_of_relatives: "Mãe",
    isMe: false,
    isAdmin: false,
  },
  {
    id: 4,
    name: "Ana Beatriz",
    degree_of_relatives: "Filha",
    isMe: false,
    isAdmin: false,
  },
];

export function useManageFamily() {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileSelecionado, setFileSelecionado] = useState(null);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isHoveredSettings, setIsHoveredSettings] = useState(false);
  const [isHoveredView, setIsHoveredView] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [errosCampos, setErrosCampos] = useState({});
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isDeleteFamilyOpen, setIsDeleteFamilyOpen] = useState(false);

  const [familiars, setFamiliars] = useState(INITIAL_FAMILIARS);
  const [isEditing, setIsEditing] = useState(false);

  const [minhasPermissoes, setMinhasPermissoes] = useState({
    editar_calendario: false,
    gerenciar_listas: false,
    controlar_despesas: false,
    alterar_informacoes: false,
  });

  const [familyData, setFamilyData] = useState({
    nome: "",
    telefone: "",
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    membros: [],
    foto: null,
  });
  const [formData, setFormData] = useState(familyData);

  const idFamilia = sessionStorage.getItem("@FamilySync:family:id");

  const myUserId = useMemo(() => {
    const token = Cookies.get("familysync_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return String(decoded.id_usuario || decoded.id);
      } catch (error) {
        console.error("Erro ao descodificar token:", error);
      }
    }
    return null;
  }, []);

  const fetchApiData = async () => {
    if (!idFamilia) return;
    try {
      setIsLoading(true);

      const response = await familyService.getFamilyComplete(idFamilia);

      if (myUserId) {
        try {
          const permData = await permissaoService.getPermissaoUsuario(
            myUserId,
            idFamilia,
          );
          if (permData?.Response?.usuarios?.[0]?.permissoes) {
            setMinhasPermissoes(permData.Response.usuarios[0].permissoes);
          }
        } catch (permError) {
          console.warn(
            "Utilizador sem permissões específicas registadas ainda ou erro ao buscar.",
            permError,
          );
        }
      }

      const responseData = response?.Response || response || {};

      const familiaInfo = Array.isArray(responseData.familia)
        ? responseData.familia[0]
        : responseData.familia || {};

      const enderecoInfo = Array.isArray(responseData.endereco)
        ? responseData.endereco[0]
        : responseData.endereco || {};

      const dadosDaAPI = {
        nome: familiaInfo?.nome || "",
        telefone:
          familiaInfo?.telefone_residencial &&
          familiaInfo?.telefone_residencial !== "null"
            ? familiaInfo.telefone_residencial
            : "",
        cep: enderecoInfo?.cep || "",
        cidade: enderecoInfo?.cidade || "",
        estado: enderecoInfo?.estado || "",
        bairro: enderecoInfo?.bairro || "",
        logradouro: enderecoInfo?.logradouro || "",
        numero: enderecoInfo?.numero || "",
        complemento: enderecoInfo?.complemento || "",
        membros: formData.membros || [],
        foto:
          familiaInfo?.foto ||
          familiaInfo?.foto_perfil ||
          familiaInfo?.avatar ||
          null,
      };

      setFamilyData(dadosDaAPI);
      setFormData(dadosDaAPI);

      if (dadosDaAPI.foto) {
        setPreview(dadosDaAPI.foto);
      }

      if (response.Response.usuarios) {
        const membrosFormatados = response.Response.usuarios.map((user) => ({
          id: user.id_usuario,
          name: user.nome,
          degree_of_relatives: user.parentesco || "Membro",
          foto: user.foto_perfil || user.foto || user.avatar || null,
          isAdmin:
            user.tipo_permissao === "admin" ||
            user.permissao === "admin" ||
            user.is_admin === true ||
            Number(user.is_admin) === 1 ||
            user.admin === true ||
            Number(user.admin) === 1 ||
            String(user.nivel_acesso).toLowerCase() === "admin",
        }));

        setFamiliars(membrosFormatados);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da família:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, [idFamilia]);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const openPermissionsModal = (member) => {
    setSelectedMember(member);
    setIsPermissionsOpen(true);
    setActiveMenuId(null);
    setIsHoveredSettings(false);
    setIsHoveredView(false);
  };

  const closePermissionsModal = () => {
    setIsPermissionsOpen(false);
    setSelectedMember(null);
  };

  const openDeleteModal = (member) => {
    setSelectedMember(member);
    setIsDeleteOpen(true);
    setActiveMenuId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSelectedMember(null);
  };

  const confirmDeleteMember = async () => {
    if (!selectedMember || !idFamilia) return;
    try {
      setIsLoading(true);
      await familyService.outUserFamily(idFamilia, selectedMember.id);
      setFamiliars((prev) => prev.filter((m) => m.id !== selectedMember.id));
      closeDeleteModal();
    } catch (error) {
      console.error("Erro ao remover o membro da família:", error);
      alert("Falha ao remover o membro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!isEditing) return;
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formatosPermitidos = ["image/png", "image/jpeg", "image/jpg"];
    if (!formatosPermitidos.includes(file.type)) {
      alert(
        "Formato inválido! Por favor, selecione apenas imagens em formato PNG ou JPG.",
      );
      e.target.value = "";
      setFileSelecionado(null);
      setPreview(familyData.foto);
      return;
    }

    setFileSelecionado(file);
    const reader = new FileReader();
    reader.onloadend = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImagem = () => {
    if (!isEditing) return;
    setPreview(null);
    setFileSelecionado(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setFormData(familyData);
      setPreview(familyData.foto);
      setFileSelecionado(null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveFamilyData = async () => {
    try {
      setIsLoading(true);
      const formPayload = new FormData();
      formPayload.append("nome", formData.nome);

      const telefoneLimpo = formData.telefone.replace(/\D/g, "");
      formPayload.append("telefone", telefoneLimpo);

      const cepLimpo = formData.cep.replace(/\D/g, "");
      formPayload.append("cep", cepLimpo);

      formPayload.append("cidade", formData.cidade);
      formPayload.append("estado", formData.estado);
      formPayload.append("bairro", formData.bairro);
      formPayload.append("logradouro", formData.logradouro);
      formPayload.append("numero", formData.numero);
      formPayload.append("complemento", formData.complemento || "");

      if (fileSelecionado) {
        formPayload.append("foto", fileSelecionado);
      }

      await familyService.updateFamilyEndereco(idFamilia, formPayload);
      setFamilyData(formData);
      setFileSelecionado(null);
      setIsEditing(false);
      alert("Informações salvas com sucesso!");
      fetchApiData();
    } catch (error) {
      console.error("Erro ao salvar dados", error);
      alert("Falha ao salvar as alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveFamily = async () => {
    const confirm = window.confirm(
      "Tem certeza que deseja sair desta família? Você perderá acesso a todos os dados.",
    );
    if (confirm) {
      try {
        await confirmLeaveFamily();
      } catch (error) {
        console.error("Erro ao sair da família", error);
      }
    }
  };

  const handleAddMember = async () => {
    if (!currentEmail.trim()) return;

    const erroValidacao = validateEmail(currentEmail);
    if (erroValidacao) {
      setErrosCampos((prev) => ({ ...prev, membros: erroValidacao }));
      return;
    }

    setIsLoading(true);
    try {
      await familyService.createMemberByEmailFamily({
        id_familia: idFamilia,
        email: [currentEmail],
      });

      setCurrentEmail("");
      setErrosCampos({});
      fetchApiData();
    } catch (error) {
      console.error("Erro ao convidar membro:", error);
      setErrosCampos((prev) => ({
        ...prev,
        membros: "Erro ao enviar convite. Tente novamente.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = (emailParaRemover) => {
    setFormData((prev) => ({
      ...prev,
      membros: prev.membros.filter((email) => email !== emailParaRemover),
    }));
  };

  const familiarsWithIsMe = useMemo(() => {
    return familiars.map((member) => ({
      ...member,
      isMe: myUserId ? String(member.id) === myUserId : false,
    }));
  }, [familiars, myUserId]);

  const isCurrentUserAdmin = useMemo(() => {
    const me = familiarsWithIsMe.find((m) => m.isMe);
    return me ? me.isAdmin : false;
  }, [familiarsWithIsMe]);

  const permissoesFinais = isCurrentUserAdmin
    ? {
        editar_calendario: true,
        gerenciar_listas: true,
        controlar_despesas: true,
        alterar_informacoes: true,
      }
    : minhasPermissoes;

  const sortedFamiliars = useMemo(() => {
    return [...familiarsWithIsMe].sort((a, b) => {
      if (a.isMe) return -1;
      if (b.isMe) return 1;

      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [familiarsWithIsMe]);

  const openLeaveModal = () => {
    setIsLeaveOpen(true);
  };

  const closeLeaveModal = () => {
    setIsLeaveOpen(false);
  };

  const confirmLeaveFamily = async () => {
    try {
      if (idFamilia && myUserId) {
        sessionStorage.setItem("@FamilySync:family:lastId", idFamilia);
        await familyService.outUserFamily(idFamilia, myUserId);
        sessionStorage.removeItem("@FamilySync:family:id");
      }
      closeLeaveModal();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Erro ao sair da família", error);
      alert("Erro ao tentar sair da família.");
    }
  };

  const openDeleteFamilyModal = () => {
    setIsDeleteFamilyOpen(true);
  };

  const closeDeleteFamilyModal = () => {
    setIsDeleteFamilyOpen(false);
  };

  const confirmDeleteFamily = async () => {
    try {
      setIsLoading(true);
      await familyService.deleteFamilyEndereco(idFamilia);
      closeDeleteFamilyModal();
    } catch (error) {
      console.error("Erro ao excluir a família", error);
      alert("Falha ao excluir a família.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fileInputRef,
    preview,
    fileSelecionado,
    activeMenuId,
    isHoveredSettings,
    setIsHoveredSettings,
    isHoveredView,
    setIsHoveredView,
    familiars: sortedFamiliars,
    isCurrentUserAdmin,
    minhasPermissoes: permissoesFinais,
    isPermissionsOpen,
    isDeleteOpen,
    selectedMember,
    isEditing,
    formData,
    familyData,
    toggleMenu,
    openPermissionsModal,
    closePermissionsModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteMember,
    handleButtonClick,
    handleFileChange,
    removeImagem,
    toggleEditMode,
    handleInputChange,
    saveFamilyData,
    leaveFamily,
    isLoading,
    currentEmail,
    setCurrentEmail,
    handleAddMember,
    handleRemoveMember,
    errosCampos,
    setErrosCampos,
    isLeaveOpen,
    openLeaveModal,
    closeLeaveModal,
    confirmLeaveFamily,
    isDeleteFamilyOpen,
    openDeleteFamilyModal,
    closeDeleteFamilyModal,
    confirmDeleteFamily,
  };
}
