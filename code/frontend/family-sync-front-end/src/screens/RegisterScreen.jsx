import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import AccountRegister from "../components/forms/AccountRegister";
import { useState } from "react";
import { userService } from "../services/userService";

function RegisterScreen() {
  //inputs
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");

  const [erro, setErro] = useState("");

  const handleSubmit = async function () {
    try {
      setErro("");

      const dados = { nome, email, cpf, dataNascimento, senha, repetirSenha };

      console.log(dados);

      const validacao = validationFields(dados);

      console.log(validacao);
      if (validacao !== true) {
        setErro(validacao);
        return;
      }

      const response = await userService.createUser(dados);

      alert("Cadastro Finalizado! Faça login para entrar!");
    } catch (error) {
      setErro("Falha ao Cadastrar! Tente novamente mais tarde!");
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <AccountRegister
        setNome={setNome}
        setEmail={setEmail}
        setCpf={setCpf}
        setDataNascimento={setDataNascimento}
        setSenha={setSenha}
        setRepetirSenha={setRepetirSenha}
        handleSubmit={handleSubmit}
        erro={erro}
      />
    </div>
  );
}

function validationFields(dados) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!dados.nome || dados.nome.length > 100 || !isNaN(dados.nome)) {
    return "Nome inválido";
  }

  if (!dados.email || dados.email.length > 100 || !regex.test(dados.email)) {
    return "Email inválido";
  }

  if (!validarCpf(dados.cpf)) {
    return "CPF inválido";
  }

  if (!dados.dataNascimento || !validarData(dados.dataNascimento)) {
    return "Data inválida";
  }

  if (!dados.senha || dados.senha.length > 100) {
    return "Senha inválida";
  }

  if (dados.repetirSenha !== dados.senha) {
    return "As senhas não conferem";
  }

  return true;
}

function validarCpf(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const cpfDigitos = cpf.split("").map((el) => +el);

  const rest = (count) => {
    return (
      ((cpfDigitos
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10
    );
  };
  return rest(10) === cpfDigitos[9] && rest(11) === cpfDigitos[10];
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
