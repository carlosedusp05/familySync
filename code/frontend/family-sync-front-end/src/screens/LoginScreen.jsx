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

  const validateFieldOnBlur = (campoId, valor) => {
    let erroMensagem = "";
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (campoId === "email") {
      if (!valor) {
        erroMensagem = "O email é obrigatório.";
      } else if (valor.length > 100) {
        erroMensagem = "Limite de 100 caracteres excedido.";
      } else if (!regexEmail.test(valor)) {
        erroMensagem = "Formato de email inválido.";
      }
    } else if (campoId === "senha") {
      if (!valor) {
        erroMensagem = "A senha é obrigatória.";
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
        } else if (valor.length > 100) {
          erroMensagem = "Limite de 100 caracteres excedido.";
        }
      }
    }

    setErrosCampos((prev) => ({
      ...prev,
      [campoId]: erroMensagem,
    }));
  };

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

        if (
          response &&
          (response.Status === true || response.Status === "true")
        ) {
          localStorage.setItem("@FamilySync:isAuthenticated", "true");
          const userPayload = response.Response || response.data || response;
          localStorage.setItem("@FamilySync:user", JSON.stringify(userPayload));

          const splashJaRodou = sessionStorage.getItem(
            "@FamilySync:splashRodou",
          );
          const delayNavegacao = !splashJaRodou ? 300 : 0;

          if (!splashJaRodou) {
            window.dispatchEvent(new Event("startSplash"));
          }

          setIsLoading(false);

          setTimeout(() => {
            navigate("/dashboard");
          }, delayNavegacao);

          return;
        }

        setIsLoading(false);
        if (response?.StatusCode === 500 || response?.StatusCode === 404) {
          setErrosCampos((prev) => ({
            ...prev,
            email: "E-mail não encontrado.",
          }));
        } else if (response.StatusCode === 400) {
          setErrosCampos((prev) => ({
            ...prev,
            senha: "Senha inválida. Verifique se não há erros de digitação.",
          }));
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
        alt="Imagem Fundo"
        blur_or_glass="blur"
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
        onBlurField={validateFieldOnBlur}
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
  } else if (!regexEmail.test(dados.email)) {
    erros.email = "Formato de email inválido.";
    isValid = false;
  }

  if (!dados.senha) {
    erros.senha = "A senha é obrigatória.";
    isValid = false;
  } else if (dados.senha.length < 8) {
    erros.senha = "A senha deve ter no mínimo 8 caracteres.";
    isValid = false;
  }

  return { isValid, erros };
}

export default LoginScreen;
