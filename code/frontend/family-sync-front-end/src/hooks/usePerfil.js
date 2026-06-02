import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
  });
  const [userId, setUserId] = useState(null);

  // --- NOVOS ESTADOS PARA O MODAL DE ALTERAÇÃO DE SENHA ---
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    senhaAnterior: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });
  const [errosSenhaModal, setErrosSenhaModal] = useState({});

  const [familiasDisponiveis, setFamiliasDisponiveis] = useState([]);
  const [familiasSelecionadas, setFamiliasSelecionadas] = useState([]);
  const [isFamiliesOpen, setIsFamiliesOpen] = useState(false);

  const [editableFields, setEditableFields] = useState({});
  const [errosCampos, setErrosCampos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
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

        setFormData((prev) => ({
          ...prev,
          nome: decodedUser.nome || "",
          email: decodedUser.email || "",
        }));
        setIsLoading(true);

        const id_usuario = parseInt(decodedUser.id_usuario);
        const response = await userService.getFamiliesByUser(id_usuario);

        setFormData({
          nome: response.user.nome || "",
          email: response.user.email || "",
          cpf: formatCPF(response.user.cpf || ""),
          dataNascimento: formatDateForInput(response.user.data_nascimento),
          senha: "",
        });

        if (response.user.foto_perfil) setPreview(response.user.foto_perfil);

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
    navigate("/");
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

  const toggleEdit = (fieldId) => {
    setEditableFields((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }));
    if (editableFields[fieldId]) {
      setErrosCampos((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleUpdatePassword = async () => {
    const erros = {};
    if (!passwordData.senhaAnterior)
      erros.senhaAnterior = "A senha atual é obrigatória.";
    if (validatePassword(passwordData.novaSenha))
      erros.novaSenha = validatePassword(passwordData.novaSenha);
    if (passwordData.novaSenha !== passwordData.confirmarNovaSenha)
      erros.confirmarNovaSenha = "As senhas não coincidem.";

    if (Object.keys(erros).length > 0) {
      setErrosSenhaModal(erros);
      return;
    }

    setIsLoading(true);
    try {
      await userService.updateUser(userId, {
        ...formData,
        cpf: cleanCPF(formData.cpf),
        familias: familiasSelecionadas,
        senhaAnterior: passwordData.senhaAnterior,
        senha: passwordData.novaSenha,
      });

      setIsPasswordModalOpen(false);
      setPasswordData({
        senhaAnterior: "",
        novaSenha: "",
        confirmarNovaSenha: "",
      });
    } catch (error) {
      setErrosSenhaModal({
        geral:
          "Falha ao alterar senha. Verifique se a senha atual está correta.",
      });
    } finally {
      setIsLoading(false);
    }
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
      const dadosUpdate = {
        ...formData,
        nome: formatUserName(formData.nome),
        cpf: cleanCPF(formData.cpf),
        familias: familiasSelecionadas,
      };

      delete dadosUpdate.senha;

      await userService.updateUser(dadosUpdate);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImagem = () => {
    setPreview(null);
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
    errosCampos,
    isLoading,
    preview,
    setPreview,
    mostrarSenha,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    hoje,
    validateFieldOnBlur,
    toggleEdit,
    handleUpdate,
    removeImagem,
    handleButtonClick,
    handleDeleteAccount,
    handleLogout,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    passwordData,
    setPasswordData,
    errosSenhaModal,
    handleUpdatePassword,
  };
}
