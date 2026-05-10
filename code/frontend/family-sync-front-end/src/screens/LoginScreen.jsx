import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import CardLogin from "../components/forms/CardLogin";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { userService } from "../services/userService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [errosCampos, setErrosCampos] = useState({ email: "", senha: "" });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async function () {
    setErro("");
    setErrosCampos({ email: "", senha: "" });
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const dados = { email, senha };
        const validacao = validateFields(dados);

        if (!validacao.isValid) {
          setErrosCampos(validacao.erros);
          setIsLoading(false);
          return;
        }

        const senhaHasheada = CryptoJS.SHA256(senha).toString(CryptoJS.enc.Hex);

        const response = await userService.loginUser({
          email,
          senha: senhaHasheada,
        });

        if (response.Status === true) {
          localStorage.setItem("@FamilySync:isAuthenticated", "true");
          localStorage.setItem(
            "@FamilySync:user",
            JSON.stringify(response.Response),
          );

          setIsLoading(false);

          window.dispatchEvent(new Event("startSplash"));

          setTimeout(() => {
            navigate("/dashboard");
          }, 500);

          return;
        }

        console.log(response);
        setIsLoading(false);

        if (response?.StatusCode === 500 || response?.StatusCode === 404) {
          setErrosCampos((prev) => ({
            ...prev,
            email: "E-mail não encontrado.",
          }));
        } else if (response.StatusCode === 400) {
          setErro("Senha inválida. Verifique se não há erros de digitação.");
        } else {
          setErro("Erro ao tentar logar. Tente novamente mais tarde!");
        }
      } catch (error) {
        setIsLoading(false);

        if (error) {
          setErrosCampos((prev) => ({
            ...prev,
            email: "E-mail não encontrado.",
            senha: "Senha invalida",
          }));
        }
      }
    }, 50);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {isLoading && <LoadingOverlay />}

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
  const regexSenha =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_=+ \-]).+$/;

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
      isValid = false;
      let mensagens = [];

      if (tamanhoCurto) mensagens.push("ter pelo menos 8 caracteres");

      if (faltaMinuscula) mensagens.push("conter letras minúsculas");

      if (faltaMaiuscula) mensagens.push("incluir letras maiúsculas");

      if (faltaNumero) mensagens.push("ter pelo menos um número");

      if (faltaEspecial) mensagens.push("usar símbolos (ex: @, #, +, -)");

      const fraseFinal = mensagens.join(", ").replace(/, ([^,]*)$/, " e $1");
      erros.senha = `Sua senha precisa ${fraseFinal}.`;
    }
  }

  if (dados.senha.length > 100) {
    erros.senha = "Limite de 100 caracteres excedido.";
    isValid = false;
  }
  return { isValid, erros };
}

export default LoginScreen;
