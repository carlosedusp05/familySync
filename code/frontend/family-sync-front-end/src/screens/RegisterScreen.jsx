import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground, eyeIcon, closedEye } from "../assets";
import AccountRegister from "../components/forms/AccountRegister";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useState } from "react";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
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

function RegisterScreen() {
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

  const [preview, setPreview] = useState(null);
  const [fileSelecionado, setFileSelecionado] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="h-screen w-full flex justify-center items-center">
      {isLoading && <LoadingOverlay />}
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <AccountRegister
        nome={nome}
        email={email}
        cpf={cpf}
        dataNascimento={dataNascimento}
        senha={senha}
        repetirSenha={repetirSenha}
        setNome={setNome}
        setEmail={setEmail}
        setCpf={setCpf}
        setDataNascimento={setDataNascimento}
        setSenha={setSenha}
        setRepetirSenha={setRepetirSenha}
        handleSubmit={handleSubmit}
        erro={erro}
        errosCampos={errosCampos}
        setErrosCampos={setErrosCampos}
        preview={preview}
        handleFileChange={handleFileChange}
        removeImagem={removeImagem}
        typeSenha={mostrarSenha ? "text" : "password"}
        srcSenha={mostrarSenha ? eyeIcon : closedEye}
        onClickIconSenha={togglePasswordVisibility}
        typeRepetirSenha={mostrarRepetirSenha ? "text" : "password"}
        srcRepetirSenha={mostrarRepetirSenha ? eyeIcon : closedEye}
        onClickIconRepetirSenha={toggleRepeatPasswordVisibility}
        onBlurField={validateFieldOnBlur}
      />
    </div>
  );
}

export default RegisterScreen;
