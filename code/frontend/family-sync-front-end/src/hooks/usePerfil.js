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
    senha: "",
  });

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

      const decodedUser = jwtDecode(token);

      setFormData((prev) => ({
        ...prev,
        nome: decodedUser.nome || "",
        email: decodedUser.email || "",
      }));
      setIsLoading(true);

      try {
        const id_usuario = parseInt(decodedUser.id_usuario);

        const [response, familias] = await Promise.all([
          userService.getUserById(id_usuario),
          Promise.resolve([
            { id: 1, nome: "Família Silva" },
            { id: 2, nome: "Família Oliveira" },
            { id: 3, nome: "Família Souza" },
          ]),
        ]);

        const user = response.Response[0];

        setFormData({
          nome: user.nome || "",
          email: user.email || "",
          cpf: formatCPF(user.cpf || ""),
          dataNascimento: formatDateForInput(user.data_nascimento),
          senha: "",
        });

        if (user.foto_perfil) setPreview(user.foto_perfil);

        setFamiliasDisponiveis(familias);
        setFamiliasSelecionadas(user.familias?.map((f) => f.id) || [1]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

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
      case "senha":
        if (valor) erroMensagem = validatePassword(valor);
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
    if (fieldId === "senha" && !editableFields["senha"]) {
      setMostrarSenha(true);
    }
  };

  const handleUpdate = async () => {
    const erros = {
      nome: validateName(formData.nome),
      email: validateEmail(formData.email),
      cpf: validarCpf(formData.cpf),
      dataNascimento: validarDataNascimento(formData.dataNascimento),
    };

    if (formData.senha) erros.senha = validatePassword(formData.senha);

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

      if (formData.senha) {
        dadosUpdate.senha = CryptoJS.SHA256(formData.senha).toString(
          CryptoJS.enc.Hex,
        );
      } else {
        delete dadosUpdate.senha;
      }

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
      const storedUser = JSON.parse(localStorage.getItem("@FamilySync:user"));
      const id_usuario = parseInt(storedUser.id_usuario);

      await userService.deleteUser(id_usuario);

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName, { path: "/" });
    });
    navigate("/");
  };

  return {
    navigate,
    fileInputRef,
    formData,
    setFormData,
    familiasDisponiveis,
    familiasSelecionadas,
    setFamiliasSelecionadas,
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
  };
}
