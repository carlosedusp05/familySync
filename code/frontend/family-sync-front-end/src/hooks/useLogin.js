import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { userService } from "../services/userService";
import {
  validateEmail,
  validatePassword,
  validateLoginFields,
} from "../utils/validators.js";

export function useLogin() {
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

        if (
          response &&
          (response.Status === true ||
            response.Status === "true" ||
            response.token)
        ) {
          const token = response.token || response.Response;

          if (!token) {
            setErro("Token não recebido do servidor.");
            setIsLoading(false);
            return;
          }

          Cookies.set("familysync_token", token, {
            expires: 1,
            secure: true,
            sameSite: "strict",
            path: "/",
          });

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

  return {
    email,
    setEmail,
    senha,
    setSenha,
    erro,
    errosCampos,
    setErrosCampos,
    isLoading,
    validateFieldOnBlur,
    handleSubmit,
  };
}
