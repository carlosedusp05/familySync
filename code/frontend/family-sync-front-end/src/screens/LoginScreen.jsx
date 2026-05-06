import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import CardLogin from "../components/forms/CardLogin";
import { loginUser } from "../../services/userService";
import { useState } from "react";

function LoginScreen() {
  // Inputs
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async function () {
    try {
      setErro("");

      const dados = { email, senha };

      const validacao = validateFields(dados);
      if (!validacao) {
        setErro(validacao);
        return;
      }

      const response = await loginUser(dados);
    } catch (error) {
      // Arrumar Gestão de Erro Depois
      setErro("E-mail ou Senha Incorretos!");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <CardLogin />
    </div>
  );
}

function validateFields(dados) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    dados.email == "" ||
    dados.email == null ||
    dados.email.length > 100 ||
    !regex.test(dados.email)
  ) {
    return "Email inválido";
  } else if (
    dados.senha == "" ||
    dados.senha == null ||
    dados.senha.length > 50
  ) {
    return "Senha inválida";
  } else {
    return true;
  }
}

export default LoginScreen;
