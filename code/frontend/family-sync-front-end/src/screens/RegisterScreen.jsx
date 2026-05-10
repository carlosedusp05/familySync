import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground, eyeIcon, closedEye } from "../assets";
import AccountRegister from "../components/forms/AccountRegister";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { useState } from "react";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

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
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    switch (campoId) {
      case "nome":
        if (!valor || valor.trim().length < 3 || !isNaN(valor)) {
          erroMensagem = "Insira um nome válido (mínimo 3 caracteres)";
        }
        break;
      case "email":
        if (!valor) {
          erroMensagem = "O e-mail é obrigatório";
        } else if (!regexEmail.test(valor)) {
          erroMensagem = "Insira um formato de e-mail válido";
        } else if (valor.length > 100) {
          erroMensagem = "O e-mail deve ter no máximo 100 caracteres";
        }
        break;
      case "cpf":
        if (!validarCpf(valor)) {
          erroMensagem = "CPF inválido";
        }
        break;
      case "dataNascimento":
        if (!valor || !validarData(valor)) {
          erroMensagem = "Data de nascimento inválida ou futura";
        }
        break;
      case "senha":
        if (!valor) {
          erroMensagem = "A senha é obrigatória";
        } else {
          const faltaMinuscula = !/[a-z]/.test(valor);
          const faltaMaiuscula = !/[A-Z]/.test(valor);
          const faltaNumero = !/\d/.test(valor);
          const faltaEspecial = !/[!@#$%^&*(),.?":{}|<>_=+ \-]/.test(valor);
          const tamanhoCurto = valor.length < 8;

          if (
            tamanhoCurto ||
            faltaMinuscula ||
            faltaMaiuscula ||
            faltaNumero ||
            faltaEspecial
          ) {
            let mensagens = [];

            if (tamanhoCurto) mensagens.push("ter pelo menos 8 caracteres");
            if (faltaMinuscula) mensagens.push("conter letras minúsculas");
            if (faltaMaiuscula) mensagens.push("incluir letras maiúsculas");
            if (faltaNumero) mensagens.push("ter pelo menos um número");
            if (faltaEspecial) mensagens.push("usar símbolos (ex: @, #, +, -)");

            const fraseFinal = mensagens
              .join(", ")
              .replace(/, ([^,]*)$/, " e $1");
            erroMensagem = `Sua senha precisa ${fraseFinal}.`;
          } else if (valor.length > 128) {
            erroMensagem = "A senha excedeu o limite de 128 caracteres";
          }
        }
        break;
      case "repetirSenha":
        if (!valor) {
          erroMensagem = "Confirme sua senha";
        } else if (valor !== senha) {
          erroMensagem = "As senhas não conferem";
        }
        break;
      default:
        break;
    }

    setErrosCampos((prev) => {
      const novosErros = { ...prev };
      if (erroMensagem) {
        novosErros[campoId] = erroMensagem;
      } else {
        delete novosErros[campoId];
      }
      return novosErros;
    });
  };

  const handleSubmit = async function () {
    setErro("");
    setErrosCampos({});
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const dados = { nome, email, cpf, dataNascimento, senha, repetirSenha };
        const validacao = validationFields(dados);

        if (validacao !== true) {
          setErrosCampos(validacao);
          setIsLoading(false);
          return;
        }

        const senhaHasheada = CryptoJS.SHA256(senha).toString(CryptoJS.enc.Hex);

        const dadosBackend = {
          nome: nome
            .toLowerCase()
            .split(" ")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" "),
          email: email,
          cpf: cpf.replace(/\D/g, ""),
          data_nascimento: dataNascimento,
          senha: senhaHasheada,
        };

        const response = await userService.createUser(dadosBackend);

        if (response) {
          navigate("/auth/login");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setErro("Falha ao Cadastrar! Tente novamente mais tarde!");
      }
    }, 50);
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
        onBlurField={validateFieldOnBlur} // 👉 Passando a prop aqui!
      />
    </div>
  );
}

function validationFields(dados) {
  const errors = {};

  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!dados.nome || dados.nome.trim().length < 3 || !isNaN(dados.nome)) {
    errors.nome = "Insira um nome válido (mínimo 3 caracteres)";
  }

  if (!dados.email) {
    errors.email = "O e-mail é obrigatório";
  } else if (!regexEmail.test(dados.email)) {
    errors.email = "Insira um formato de e-mail válido";
  } else if (dados.email.length > 100) {
    errors.email = "O e-mail deve ter no máximo 100 caracteres";
  }

  if (!validarCpf(dados.cpf)) {
    errors.cpf = "CPF inválido";
  }

  if (!dados.dataNascimento || !validarData(dados.dataNascimento)) {
    errors.dataNascimento = "Data de nascimento inválida ou futura";
  }

  if (!dados.senha) {
    errors.senha = "A senha é obrigatória";
  } else {
    const faltaMinuscula = !/[a-z]/.test(dados.senha);
    const faltaMaiuscula = !/[A-Z]/.test(dados.senha);
    const faltaNumero = !/\d/.test(dados.senha);
    const faltaEspecial = !/[!@#$%^&*(),.?":{}|<>_=+ \-]/.test(dados.senha);
    const tamanhoCurto = dados.senha.length < 8;

    if (
      tamanhoCurto ||
      faltaMinuscula ||
      faltaMaiuscula ||
      faltaNumero ||
      faltaEspecial
    ) {
      let mensagens = [];

      if (tamanhoCurto) mensagens.push("ter pelo menos 8 caracteres");
      if (faltaMinuscula) mensagens.push("conter letras minúsculas");
      if (faltaMaiuscula) mensagens.push("incluir letras maiúsculas");
      if (faltaNumero) mensagens.push("ter pelo menos um número");
      if (faltaEspecial) mensagens.push("usar símbolos (ex: @, #, +, -)");

      const fraseFinal = mensagens.join(", ").replace(/, ([^,]*)$/, " e $1");
      errors.senha = `Sua senha precisa ${fraseFinal}.`;
    } else if (dados.senha.length > 128) {
      errors.senha = "A senha excedeu o limite de 128 caracteres";
    }
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
