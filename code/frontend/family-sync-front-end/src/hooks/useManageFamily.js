import { useRef, useState, useEffect } from "react";
import { familyService } from "../services/familyService";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { validateEmail } from "../utils/validators";

const INITIAL_FAMILIARS = [
  { id: 3, name: "Lucas Gabriel", degree_of_relatives: "Filho", isMe: true },
  { id: 1, name: "João Pedro Silva", degree_of_relatives: "Pai", isMe: false },
  { id: 2, name: "Maria Alice", degree_of_relatives: "Mãe", isMe: false },
  { id: 4, name: "Ana Beatriz", degree_of_relatives: "Filha", isMe: false },
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

  const [familiars, setFamiliars] = useState(() => {
    const savedMembers = localStorage.getItem("family_members");
    return savedMembers ? JSON.parse(savedMembers) : INITIAL_FAMILIARS;
  });

  const [isEditing, setIsEditing] = useState(false);

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
  });
  const [formData, setFormData] = useState(familyData);

  const idFamilia = sessionStorage.getItem("@FamilySync:family:id");

  const fetchApiData = async () => {
    try {
      const response = await familyService.getFamilyComplete(idFamilia);

      const dadosDaAPI = {
        nome: response.Response.familia[0].nome,
        telefone: response.Response.familia[0].telefone_residencial || "",
        cep: response.Response.endereco[0].cep,
        cidade: response.Response.endereco[0].cidade,
        estado: response.Response.endereco[0].estado,
        bairro: response.Response.endereco[0].bairro,
        logradouro: response.Response.endereco[0].logradouro,
        numero: response.Response.endereco[0].numero,
        complemento: response.Response.endereco[0].complemento,
        membros: formData.membros || [],
      };

      setFamilyData(dadosDaAPI);
      setFormData(dadosDaAPI);

      if (response.Response.usuarios) {
        const token = Cookies.get("familysync_token");
        let myUserId = "";

        if (token) {
          const decoded = jwtDecode(token);
          myUserId = String(decoded.id_usuario || decoded.id);
        }

        const membrosFormatados = response.Response.usuarios.map((user) => ({
          id: user.id,
          name: user.nome,
          degree_of_relatives: user.parentesco || "Membro",
          isMe: myUserId ? String(user.id) === myUserId : false,
        }));

        setFamiliars(membrosFormatados);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da família:", error);
    }
  };

  useEffect(() => {
    if (idFamilia) {
      fetchApiData();
    }
  }, [idFamilia]);

  useEffect(() => {
    fetchApiData();
  }, [idFamilia]);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await familyService.getFamilyComplete(idFamilia);

        const dadosDaAPI = {
          nome: response.Response.familia[0].nome,
          telefone: response.Response.familia[0].telefone_residencial || "",
          cep: response.Response.endereco[0].cep,
          cidade: response.Response.endereco[0].cidade,
          estado: response.Response.endereco[0].estado,
          bairro: response.Response.endereco[0].bairro,
          logradouro: response.Response.endereco[0].logradouro,
          numero: response.Response.endereco[0].numero,
          complemento: response.Response.endereco[0].complemento,
        };

        setFamilyData(dadosDaAPI);
        setFormData(dadosDaAPI);

        if (response.Response.usuarios) {
          const token = Cookies.get("familysync_token");

          if (token) {
            const decoded = jwtDecode(token);
            myUserId = String(decoded.id_usuario || decoded.id);
          }

          const membrosFormatados = response.Response.usuarios.map((user) => ({
            id: user.id,
            name: user.nome,
            degree_of_relatives: user.parentesco || "Membro",
            isMe: myUserId ? String(user.id) === myUserId : false,
          }));

          setFamiliars(membrosFormatados);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da família:", error);
      }
    };
    fetchApiData();
  }, [idFamilia]);

  useEffect(() => {
    localStorage.setItem("family_members", JSON.stringify(familiars));
  }, [familiars]);

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

  const confirmDeleteMember = () => {
    if (selectedMember) {
      setFamiliars((prev) => prev.filter((m) => m.id !== selectedMember.id));
      closeDeleteModal();
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
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveFamilyData = async () => {
    try {
      console.log("Enviando para API:", formData);
      setFamilyData(formData);
      setIsEditing(false);
      alert("Informações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar dados", error);
      alert("Falha ao salvar as alterações.");
    }
  };

  const leaveFamily = async () => {
    const confirm = window.confirm(
      "Tem certeza que deseja sair desta família? Você perderá acesso a todos os dados.",
    );
    if (confirm) {
      try {
        alert("Você saiu da família com sucesso.");
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
      const idFamilia = sessionStorage.getItem("@FamilySync:family:id");

      await familyService.createMemberByEmailFamily({
        id_familia: idFamilia,
        email: [currentEmail],
      });

      alert("Convite enviado com sucesso!");
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

  return {
    fileInputRef,
    preview,
    fileSelecionado,
    activeMenuId,
    isHoveredSettings,
    setIsHoveredSettings,
    isHoveredView,
    setIsHoveredView,
    familiars,
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
    handleAddMember,
    handleRemoveMember,
    errosCampos,
    setErrosCampos,
    handleRemoveMember,
  };
}
