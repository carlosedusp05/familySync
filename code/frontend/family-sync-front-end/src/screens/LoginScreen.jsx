import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import CardLogin from "../components/forms/CardLogin";
import { userService } from "../services/userService";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Adicionado para o navigate funcionar

function LoginScreen() {
  const navigate = useNavigate();

  // Inputs controlados pelo Pai
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Controle de Erros
  const [erro, setErro] = useState(""); // Erro geral (ex: backend, credenciais inválidas)
  const [errosCampos, setErrosCampos] = useState({ email: "", senha: "" }); // Erros específicos dos inputs

  const handleSubmit = async function () {
    try {
      setErro("");
      setErrosCampos({ email: "", senha: "" });

      const dados = { email, senha };

      const validacao = validateFields(dados);

      if (!validacao.isValid) {
        // Se não for válido, injetamos os erros específicos nos inputs
        setErrosCampos(validacao.erros);
        return;
      }

      const response = await userService.loginUser(dados);
      navigate("/dashboard");
    } catch (error) {
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
      <CardLogin
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

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!dados.email || dados.email.length > 100 || !regex.test(dados.email)) {
    erros.email = "Email inválido";
    isValid = false;
  }

  if (!dados.senha || dados.senha.length > 100) {
    erros.senha = "Senha inválida";
    isValid = false;
  }

  return { isValid, erros };
}

export default LoginScreen;
