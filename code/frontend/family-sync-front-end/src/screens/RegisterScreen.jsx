import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground, eyeIcon, closedEye } from "../assets";
import AccountRegister from "../components/forms/AccountRegister";
import { useState } from "react";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = async function () {
    try {
      setErro("");
      setErrosCampos({});

      const dados = { nome, email, cpf, dataNascimento, senha, repetirSenha };
      const validacao = validationFields(dados);

      if (validacao !== true) {
        setErrosCampos(validacao);
        return;
      }

      const dadosBackend = {
        nome: nome,
        email: email,
        cpf: cpf.replace(/\D/g, ""),
        data_nascimento: dataNascimento,
        senha: senha,
      };

      const response = await userService.createUser(dadosBackend);

      if (response) {
        navigate("/auth/login");
      }
    } catch (error) {
      setErro("Falha ao Cadastrar! Tente novamente mais tarde!");
    }
  };

  const orangeFilter =
    "invert-[52%] sepia-[91%] saturate-[3258%] hue-rotate-[1deg] brightness-[103%] contrast-[104%]";

  return (
    <div className="h-screen w-full flex justify-center items-center">
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
        iconClassSenha={mostrarSenha ? orangeFilter : ""}
        onClickIconSenha={togglePasswordVisibility}
        typeRepetirSenha={mostrarRepetirSenha ? "text" : "password"}
        srcRepetirSenha={mostrarRepetirSenha ? eyeIcon : closedEye}
        iconClassRepetirSenha={mostrarRepetirSenha ? orangeFilter : ""}
        onClickIconRepetirSenha={toggleRepeatPasswordVisibility}
      />
    </div>
  );
}

function validationFields(dados) {
  const errors = {};
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!dados.nome || dados.nome.length > 100 || !isNaN(dados.nome)) {
    errors.nome = "Nome inválido";
  }

  if (!dados.email || dados.email.length > 100 || !regex.test(dados.email)) {
    errors.email = "Email inválido";
  }

  if (!validarCpf(dados.cpf)) {
    errors.cpf = "CPF inválido";
  }

  if (!dados.dataNascimento || !validarData(dados.dataNascimento)) {
    errors.dataNascimento = "Data inválida";
  }

  if (!dados.senha || dados.senha.length > 100) {
    errors.senha = "Senha inválida";
  }

  if (!dados.repetirSenha) {
    errors.repetirSenha = "Confirme sua senha";
  } else if (dados.repetirSenha !== dados.senha) {
    errors.repetirSenha = "As senhas não conferem";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }
  return true;
}

function validarCpf(cpf) {
  if (!cpf) return false;

  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const cpfDigitos = cpf.split("").map(Number);

  const calcularDigito = (quantidade) => {
    const soma = cpfDigitos
      .slice(0, quantidade - 1)
      .reduce((acc, curr, index) => acc + curr * (quantidade - index), 0);

    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const digito1 = calcularDigito(10);
  const digito2 = calcularDigito(11);

  return digito1 === cpfDigitos[9] && digito2 === cpfDigitos[10];
}

function validarData(data) {
  var dataSelecionada = new Date(data);
  var hoje = new Date();
  if (dataSelecionada > hoje) {
    return false;
  }
  return true;
}

export default RegisterScreen;
