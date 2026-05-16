import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { userService } from "../services/userService";
import {
  validateName,
  validateEmail,
  validarCpf,
  validarDataNascimento,
  validatePassword,
  validateConfirmPassword,
  validateRegisterFields,
} from "../utils/validators.js";
import { formatUserName, cleanCPF } from "../utils/formatters.js";

export function useRegister() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarRepetirSenha, setMostrarRepetirSenha] = useState(false);

  const [erro, setErro] = useState("");
  const [errosCampos, setErrosCampos] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [preview, setPreview] = useState(null);
  const [fileSelecionado, setFileSelecionado] = useState(null);

  const togglePasswordVisibility = () => setMostrarSenha(!mostrarSenha);
  const toggleRepeatPasswordVisibility = () =>
    setMostrarRepetirSenha(!mostrarRepetirSenha);

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
    setPreview(null);
    setFileSelecionado(null);
  };
  const validateFieldOnBlur = (campoId, valor) => {
    let erroMensagem = "";

    switch (campoId) {
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
        break;
      case "senha":
        erroMensagem = validatePassword(valor);
        break;
      case "repetirSenha":
        erroMensagem = validateConfirmPassword(senha, valor);
        break;
    }

    setErrosCampos((prev) => {
      const novos = { ...prev };
      erroMensagem ? (novos[campoId] = erroMensagem) : delete novos[campoId];
      return novos;
    });
  };

  const handleSubmit = async function () {
    const { isValid, erros } = validateRegisterFields({
      nome,
      email,
      cpf,
      dataNascimento,
      senha,
      repetirSenha,
    });

    if (!isValid) {
      setErrosCampos(erros);
      return;
    }

    setIsLoading(true);
    try {
      const senhaHasheada = CryptoJS.SHA256(senha).toString(CryptoJS.enc.Hex);

      const dadosBackend = {
        nome: formatUserName(nome),
        email,
        cpf: cleanCPF(cpf),
        data_nascimento: dataNascimento,
        senha: senhaHasheada,
      };

      const response = await userService.createUser(dadosBackend);
      console.log(response);

      if (response.StatusCode == 201) navigate("/auth/login");
      else
        setErrosCampos((prev) => ({
          ...prev,
          email: "Verifique se este e-mail já foi usado.",
          cpf: "Verifique se este CPF já foi usado.",
        }));
    } catch (error) {
      setErro("Falha ao Cadastrar! Tente novamente mais tarde!");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nome,
    setNome,
    email,
    setEmail,
    cpf,
    setCpf,
    dataNascimento,
    setDataNascimento,
    senha,
    setSenha,
    repetirSenha,
    setRepetirSenha,
    mostrarSenha,
    togglePasswordVisibility,
    mostrarRepetirSenha,
    toggleRepeatPasswordVisibility,
    erro,
    errosCampos,
    setErrosCampos,
    preview,
    handleFileChange,
    removeImagem,
    isLoading,
    validateFieldOnBlur,
    handleSubmit,
  };
}
