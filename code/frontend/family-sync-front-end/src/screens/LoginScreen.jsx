import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import CardLogin from "../components/forms/CardLogin";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { userService } from "../services/userService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import {
  validateEmail,
  validatePassword,
  validateLoginFields,
} from "../utils/validators.js";

function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [errosCampos, setErrosCampos] = useState({ email: "", senha: "" });

  const [isLoading, setIsLoading] = useState(false);

  const validateFieldOnBlur = (campoId, valor) => {
    let erroMensagem = "";

    if (campoId === "email") erroMensagem = validateEmail(valor);
    if (campoId === "senha") erroMensagem = validatePassword(valor);

    setErrosCampos((prev) => ({ ...prev, [campoId]: erroMensagem }));
  };

  const handleSubmit = async function () {
    setErro("");
    setErrosCampos({ email: "", senha: "" });
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const { isValid, erros } = validateLoginFields({ email, senha });

        if (!isValid) {
          setErrosCampos(erros);
          setIsLoading(false);
          return;
        }

        const senhaHasheada = CryptoJS.SHA256(senha).toString(CryptoJS.enc.Hex);
        const response = await userService.loginUser({
          email,
          senha: senhaHasheada,
        });
        console.log(response);

        if (
          response &&
          (response.Status === true || response.Status === "true")
        ) {
          localStorage.setItem("@FamilySync:isAuthenticated", "true");
          const userPayload = response.Response || response.data || response;

          const { senha, password, ...safeUser } = userPayload;

          localStorage.setItem("@FamilySync:user", JSON.stringify(safeUser));

          sessionStorage.removeItem("@FamilySync:splashRodou");

          window.dispatchEvent(new Event("startSplash"));

          setIsLoading(false);

          navigate("/dashboard");
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
        setErrosCampos((prev) => ({
          ...prev,
          email: "E-mail não encontrado.",
          senha: "Senha invalida",
        }));
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

export default LoginScreen;
