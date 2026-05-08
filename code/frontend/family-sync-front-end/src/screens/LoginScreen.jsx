import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import CardLogin from "../components/forms/CardLogin";
import { userService } from "../services/userService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [errosCampos, setErrosCampos] = useState({ email: "", senha: "" });

  const handleSubmit = async function () {
    try {
      setErro("");
      setErrosCampos({ email: "", senha: "" });

      const dados = { email, senha };
      const validacao = validateFields(dados);

      if (!validacao.isValid) {
        setErrosCampos(validacao.erros);
        return;
      }

      const response = await userService.loginUser({ email, senha });

      if (response === true || response?.status === true) {
        localStorage.setItem("@FamilySync:isAuthenticated", "true");

        if (response.usuario) {
          localStorage.setItem(
            "@FamilySync:user",
            JSON.stringify(response.usuario),
          );
        }

        navigate("/dashboard");
        return;
      }

      if (response?.StatusCode === 404) {
        setErrosCampos((prev) => ({
          ...prev,
          email:
            "E-mail não encontrado. Verifique se digitou corretamente ou crie uma conta.",
        }));
      } else {
        setErro("E-mail ou senha incorretos.");
      }
    } catch (error) {
      if (error?.status === 404 || error?.StatusCode === 404) {
        setErrosCampos((prev) => ({
          ...prev,
          email: "E-mail não encontrado.",
        }));
      } else if (error?.status === 401) {
        setErro("Senha incorreta.");
      } else {
        setErro("Erro ao tentar logar. Tente novamente mais tarde!");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <CardLogin
        email={email}
        senha={senha}
        setEmail={setEmail}
        setSenha={setSenha}
        handleSubmit={handleSubmit}
        erro={erro}
        errosCampos={errosCampos}
        setErrosCampos={setErrosCampos}
      />
    </div>
  );
}

function validateFields(dados) {
  const erros = { email: "", senha: "" };
  let isValid = true;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!dados.email) {
    erros.email = "O email é obrigatório.";
    isValid = false;
  } else if (dados.email.length > 100) {
    erros.email = "Limite de 100 caracteres excedido.";
    isValid = false;
  } else if (!regexEmail.test(dados.email)) {
    erros.email = "Formato de email inválido.";
    isValid = false;
  }

  if (!dados.senha) {
    erros.senha = "A senha é obrigatória.";
    isValid = false;
  } else if (dados.senha.length > 20) {
    erros.senha = "Limite de 20 caracteres excedido.";
    isValid = false;
  }

  return { isValid, erros };
}

export default LoginScreen;
