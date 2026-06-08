import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { userService } from "../services/userService";
import {
  validateName,
  validateEmail,
  validarCpf,
  validarDataNascimento,
  validatePassword,
} from "../utils/validators";
import {
  formatCPF,
  cleanCPF,
  formatUserName,
  formatDateForInput,
} from "../utils/formatters";

export function usePerfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { clearUserData } = useUser();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    senhaAnterior: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });
  const [passwordErros, setPasswordErros] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [userId, setUserId] = useState(null);
  const [fotoArquivo, setFotoArquivo] = useState(null);

  const [familiasDisponiveis, setFamiliasDisponiveis] = useState([]);
  const [familiasSelecionadas, setFamiliasSelecionadas] = useState([]);
  const [isFamiliesOpen, setIsFamiliesOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({});
  const [errosCampos, setErrosCampos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const hoje = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      const token = Cookies.get("familysync_token");

      if (!token) {
        return navigate("/auth/login");
      }

      try {
        const decodedUser = jwtDecode(token);
        setIsLoading(true);

        const id_usuario = parseInt(decodedUser.id_usuario);
        setUserId(id_usuario);

        const response = await userService.getFamiliesByUser(id_usuario);

        setFormData((prev) => ({
          ...prev,
          nome: response.user.nome || decodedUser.nome || "",
          email: response.user.email || decodedUser.email || "",
          cpf: formatCPF(response.user.cpf || ""),
          dataNascimento: formatDateForInput(response.user.data_nascimento),
        }));

        const nomeParaAvatar =
          response.user.nome || decodedUser.nome || "Usuário";
        const fotoUsuario = response.user.foto || response.user.foto_perfil;

        if (fotoUsuario && fotoUsuario !== "null") {
          const urlFinal = fotoUsuario.startsWith("http")
            ? fotoUsuario
            : `http://localhost:3000/${fotoUsuario}`;

          setPreview(urlFinal);
        } else {
          setPreview(
            `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeParaAvatar.trim())}&background=FB923C&color=fff`,
          );
        }

        setFamiliasDisponiveis(response.family);

        if (response.family && response.family.length > 0) {
          const familiaAtivaSalva = sessionStorage.getItem(
            "@FamilySync:family:id",
          );
          const familiaIdParaAtivar =
            familiaAtivaSalva &&
            response.family.some((f) => f.id === parseInt(familiaAtivaSalva))
              ? parseInt(familiaAtivaSalva)
              : response.family[0].id;

          setFamiliasSelecionadas([familiaIdParaAtivar]);
          sessionStorage.setItem("@FamilySync:family:id", familiaIdParaAtivar);
        } else {
          setFamiliasSelecionadas([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName, { path: "/" });
    });

    queryClient.removeQueries();
    queryClient.clear();

    if (clearUserData) {
      clearUserData();
    }

    setPreview(null);
    setFormData({ nome: "", email: "", cpf: "", dataNascimento: "" });
    setFamiliasDisponiveis([]);

    window.location.href = "/auth/start";
  };

  const handleSelectFamily = (id) => {
    setFamiliasSelecionadas([id]);
    sessionStorage.setItem("@FamilySync:family:id", id);
    setIsFamiliesOpen(false);
  };

  const validateFieldOnBlur = (id, valor) => {
    if (!editableFields[id]) return;

    let erroMensagem = "";
    switch (id) {
      case "nome":
        erroMensagem = validateName(valor);
        break;
      case "email":
        erroMensagem = validateEmail(valor);
        break;
      case "cpf":
        erroMensagem = validarCpf(valor);
        break;
      case "dataNascimento":
        erroMensagem = validarDataNascimento(valor);
        if (erroMensagem && new Date(valor) > new Date()) {
          setFormData((prev) => ({ ...prev, dataNascimento: hoje }));
        }
        break;
      default:
        break;
    }

    setErrosCampos((prev) => ({ ...prev, [id]: erroMensagem }));
  };

  const toggleEditingMode = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditableFields({});
      setErrosCampos({});
    } else {
      setIsEditing(true);
      setEditableFields({
        nome: true,
        email: true,
        cpf: true,
        dataNascimento: true,
      });
    }
  };

  const validatePasswordOnBlur = (id, valor) => {
    let erroMensagem = "";
    if (id === "senhaAnterior" && !valor) {
      erroMensagem = "A senha atual é obrigatória.";
    }
    if (id === "novaSenha") {
      erroMensagem = validatePassword(valor);
    }
    if (id === "confirmarNovaSenha" && valor !== passwordData.novaSenha) {
      erroMensagem = "As senhas não coincidem.";
    }
    setPasswordErros((prev) => ({ ...prev, [id]: erroMensagem }));
  };

  const handleUpdatePassword = async () => {
    const erros = {
      senhaAnterior: !passwordData.senhaAnterior
        ? "A senha atual é obrigatória."
        : "",
      novaSenha: validatePassword(passwordData.novaSenha),
      confirmarNovaSenha:
        passwordData.novaSenha !== passwordData.confirmarNovaSenha
          ? "As senhas não coincidem."
          : "",
    };

    Object.keys(erros).forEach((key) => !erros[key] && delete erros[key]);

    if (Object.keys(erros).length > 0) {
      setPasswordErros(erros);
      return;
    }

    setIsChangingPassword(true);
    try {
      const formDataEnvio = new FormData();
      formDataEnvio.append("senhaAnterior", passwordData.senhaAnterior);
      formDataEnvio.append("senha", passwordData.novaSenha);
      formDataEnvio.append("nome", formatUserName(formData.nome));
      formDataEnvio.append("email", formData.email);
      formDataEnvio.append("cpf", cleanCPF(formData.cpf));
      formDataEnvio.append("dataNascimento", formData.dataNascimento);

      await userService.updateUser(userId, formDataEnvio);

      setPasswordData({
        senhaAnterior: "",
        novaSenha: "",
        confirmarNovaSenha: "",
      });
      setPasswordErros({});
      setIsPasswordModalOpen(false);
      alert("Senha atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      setPasswordErros((prev) => ({
        ...prev,
        senhaAnterior: "Senha atual incorreta ou erro no servidor.",
      }));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const removeImagem = () => {
    const nomeAtual = formData.nome || "Usuário";
    setPreview(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeAtual)}&background=random`,
    );

    setFotoArquivo(null);
  };

  const handleUpdate = async () => {
    const erros = {
      nome: validateName(formData.nome),
      email: validateEmail(formData.email),
      cpf: validarCpf(formData.cpf),
      dataNascimento: validarDataNascimento(formData.dataNascimento),
    };

    Object.keys(erros).forEach((key) => !erros[key] && delete erros[key]);

    if (Object.keys(erros).length > 0) {
      setErrosCampos(erros);
      return;
    }

    setIsLoading(true);
    try {
      const formDataEnvio = new FormData();
      formDataEnvio.append("nome", formatUserName(formData.nome));
      formDataEnvio.append("email", formData.email);
      formDataEnvio.append("cpf", cleanCPF(formData.cpf));
      formDataEnvio.append("data_nascimento", formData.dataNascimento);

      if (fotoArquivo) {
        formDataEnvio.append("foto_perfil", fotoArquivo);
      } else if (preview === null) {
        formDataEnvio.append("remover_foto", "true");
      }
      await userService.updateUser(userId, formDataEnvio);

      setEditableFields({});
      setIsEditing(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("familysync_token");
      if (!token) return handleLogout();

      const decoded = jwtDecode(token);
      const id_usuario = parseInt(decoded.id_usuario);
      const response = await userService.deleteUser(id_usuario);

      const isSuccess =
        response &&
        (response.status === 200 ||
          response.status === 204 ||
          response.StatusCode === 200);

      if (isSuccess || !response?.error) {
        handleLogout();
      }
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return {
    navigate,
    fileInputRef,
    formData,
    setFormData,
    familiasDisponiveis,
    familiasSelecionadas,
    handleSelectFamily,
    isFamiliesOpen,
    setIsFamiliesOpen,
    editableFields,
    isEditing,
    toggleEditingMode,
    errosCampos,
    isLoading,
    preview,
    setPreview,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    hoje,
    validateFieldOnBlur,
    handleUpdate,
    removeImagem,
    handleButtonClick,
    handleDeleteAccount,
    handleLogout,
    fotoArquivo,
    setFotoArquivo,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    passwordData,
    setPasswordData,
    passwordErros,
    setPasswordErros,
    isChangingPassword,
    validatePasswordOnBlur,
    handleUpdatePassword,
  };
}
