import { useState } from "react";
import { userService } from "../services/userService";
import { validateEmail, validatePassword } from "../utils/validators.js";

export function useRememberPass() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [token, setToken] = useState("");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errosCampos, setErrosCampos] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });

  const validateFieldOnBlur = (campoId, valor) => {
    let erroMensagem = "";

    if (campoId === "email") {
      erroMensagem = validateEmail(valor);
    }
    if (campoId === "password") {
      erroMensagem = validatePassword(valor);
    }
    if (campoId === "confirmPassword") {
      if (!valor) erroMensagem = "Confirme sua senha.";
      else if (valor !== password) erroMensagem = "As senhas não coincidem.";
    }
    if (campoId === "code") {
      if (!valor) erroMensagem = "O código é obrigatório.";
    }

    setErrosCampos((prev) => ({ ...prev, [campoId]: erroMensagem }));
  };

  const handleSendEmail = async () => {
    setErro("");
    const emailErro = validateEmail(email);

    if (emailErro) {
      setErrosCampos((prev) => ({ ...prev, email: emailErro }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await userService.sendEmailForRememberPass(email);

      setToken(response.Response.code);

      if (response.StatusCode === 200) {
        setStep(2);
      } else if (response?.StatusCode === 404) {
        setErrosCampos((prev) => ({
          ...prev,
          email: "E-mail não cadastrado.",
        }));
      } else {
        setErro("Erro ao processar a solicitação. Tente novamente.");
      }
    } catch (err) {
      setErro("Falha na conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setErro("");

    const codeErro = !code ? "O código é obrigatório." : "";
    const passwordErro = validatePassword(password);
    const confirmErro =
      password !== confirmPassword ? "As senhas não coincidem." : "";

    if (codeErro || passwordErro || confirmErro) {
      setErrosCampos({
        email: "",
        code: codeErro,
        password: passwordErro,
        confirmPassword: confirmErro,
      });
      return false;
    }

    setIsLoading(true);
    try {
      const data = { senha: password, code: code };
      const response = await userService.changePassword(data, token);

      if (response.StatusCode === 200) {
        return true;
      } else if (response.StatusCode === 400) {
        setErrosCampos((prev) => ({
          ...prev,
          code: "Código inválido ou expirado.",
        }));
      } else {
        setErro("Não foi possível atualizar a senha.");
      }
      return false;
    } catch (err) {
      setErro("Erro de comunicação com o servidor.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    setStep,
    isLoading,
    erro,
    errosCampos,
    setErrosCampos,
    validateFieldOnBlur,
    email,
    setEmail,
    handleSendEmail,
    code,
    setCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleResetPassword,
  };
}
