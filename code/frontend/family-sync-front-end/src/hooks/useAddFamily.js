import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  validateName,
  validatePhone,
  validateEmail,
} from "../utils/validators.js";
import { formatPhone, formatCEP, cleanCEP } from "../utils/formatters.js";
import { viaCepService } from "../services/viaCepService.jsx";
import { familyService } from "../services/familyService.jsx";
import { enderecoService } from "../services/enderecoService.jsx";
import { userService } from "../services/userService.jsx";
import { useUser } from "../context/UserContext";

export const useAddFamily = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { refreshUser } = useUser();

  const [preview, setPreview] = useState(null);
  const [fotoUpload, setFotoUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [errosCampos, setErrosCampos] = useState({});
  const [hasFamily, setHasFamily] = useState(true);

  const [formData, setFormData] = useState({
    nomeFamilia: "",
    telefone: "",
    uf: "",
    cep: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    membros: [],
  });

  const focusOrder = [
    "nomeFamilia",
    "telefone",
    "uf",
    "cep",
    "cidade",
    "bairro",
    "logradouro",
    "numero",
    "complemento",
  ];

  useEffect(() => {
    const verificarFamiliaUsuario = async () => {
      const token = Cookies.get("familysync_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const dadosFamily = await userService.getFamiliesByUser(
            decoded.id_usuario,
          );

          if (!dadosFamily.family || dadosFamily.family.length === 0) {
            setHasFamily(false);
          }
        } catch (error) {
          console.error("Erro ao verificar vínculo familiar:", error);
        }
      }
    };
    verificarFamiliaUsuario();
  }, []);

  const handleCancelar = () => {
    if (!hasFamily) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formatosPermitidos = ["image/png", "image/jpeg", "image/jpg"];

    if (!formatosPermitidos.includes(file.type)) {
      alert(
        "Formato inválido! Por favor, selecione apenas imagens em formato PNG ou JPG.",
      );
      e.target.value = "";
      setFotoUpload(null);
      setPreview(null);
      return;
    }

    setFotoUpload(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImagem = () => {
    setFotoUpload(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validarCampo = (id, valor) => {
    let mensagem = "";

    switch (id) {
      case "nomeFamilia":
        mensagem = validateName(valor);
        break;
      case "telefone":
        mensagem = validatePhone(valor);
        break;
      case "uf":
        if (!valor || valor.length !== 2) mensagem = "UF inválida";
        break;
      case "cep":
        if (!valor || valor.replace(/\D/g, "").length < 8)
          mensagem = "CEP inválido";
        break;
      default:
        if (!valor && id !== "complemento") mensagem = "Campo obrigatório";
    }

    setErrosCampos((prev) => {
      const novos = { ...prev };
      mensagem ? (novos[id] = mensagem) : delete novos[id];
      return novos;
    });

    return mensagem;
  };

  const handleChange = (id, valor) => {
    setFormData((prev) => ({ ...prev, [id]: valor }));
    if (errosCampos[id]) {
      setErrosCampos((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentIndex = focusOrder.indexOf(id);
      if (currentIndex < focusOrder.length - 1) {
        document.getElementById(focusOrder[currentIndex + 1])?.focus();
      } else {
        document.getElementById("inputMembros")?.focus();
      }
    }
  };

  const buscarDadosCep = async (cepAtual) => {
    const cepLimpo = cleanCEP(cepAtual);

    if (cepLimpo.length === 8) {
      try {
        const data = await viaCepService.getDataByCep(cepLimpo);

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            uf: data.uf,
            cidade: data.localidade,
            bairro: data.bairro,
            logradouro: data.logradouro,
            numero: "",
          }));

          setErrosCampos((prev) => {
            const novosErros = { ...prev };
            delete novosErros.uf;
            delete novosErros.cidade;
            delete novosErros.bairro;
            delete novosErros.logradouro;
            return novosErros;
          });

          document.getElementById("numero")?.focus();
        } else {
          setErrosCampos((prev) => ({ ...prev, cep: "CEP não encontrado" }));
        }
      } catch (error) {
        setErrosCampos((prev) => ({ ...prev, cep: "Erro ao buscar CEP" }));
      }
    }
  };

  const handleAddMember = () => {
    if (!currentEmail.trim()) return;

    // Permite que o usuário cole vários e-mails com vírgula e divide em blocos no state
    const emailsList = currentEmail
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email !== "");

    if (emailsList.length === 0) return;

    let erroEncontrado = null;
    const emailsValidos = [];

    for (const email of emailsList) {
      const erroValidacao = validateEmail(email);
      if (erroValidacao) {
        erroEncontrado = `O e-mail "${email}" é inválido.`;
        break;
      }

      if (!formData.membros.includes(email) && !emailsValidos.includes(email)) {
        emailsValidos.push(email);
      }
    }

    if (erroEncontrado) {
      setErrosCampos((prev) => ({ ...prev, membros: erroEncontrado }));
      return;
    }

    if (emailsValidos.length === 0) {
      setErrosCampos((prev) => ({
        ...prev,
        membros: "E-mail(s) já adicionado(s) anteriormente",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      membros: [...prev.membros, ...emailsValidos],
    }));

    setCurrentEmail("");

    setErrosCampos((prev) => {
      const novosErros = { ...prev };
      delete novosErros.membros;
      return novosErros;
    });
  };

  const handleRemoveMember = (emailParaRemover) => {
    setFormData((prev) => ({
      ...prev,
      membros: prev.membros.filter((email) => email !== emailParaRemover),
    }));
  };

  const handleConfirmar = async () => {
    const novosErros = {};
    focusOrder.forEach((id) => {
      const erro = validarCampo(id, formData[id]);
      if (erro) novosErros[id] = erro;
    });

    if (Object.keys(novosErros).length > 0) return;

    setIsLoading(true);
    try {
      const token = Cookies.get("familysync_token");
      const decoded = jwtDecode(token);
      const user = decoded;

      const formDataEnvio = new FormData();
      formDataEnvio.append("nome", formData.nomeFamilia.trim());
      const telefoneLimpo = formData.telefone.replace(/\D/g, "");
      formDataEnvio.append("telefone", telefoneLimpo);

      formDataEnvio.append("cep", cleanCEP(formData.cep));
      formDataEnvio.append("logradouro", formData.logradouro);
      formDataEnvio.append("bairro", formData.bairro);
      formDataEnvio.append("complemento", formData.complemento || "");
      formDataEnvio.append("cidade", formData.cidade);
      formDataEnvio.append("estado", formData.uf);
      formDataEnvio.append("numero", formData.numero);

      if (fotoUpload) {
        formDataEnvio.append("foto", fotoUpload);
      }

      const responseFamilyCreation =
        await familyService.createFamilyEndereco(formDataEnvio);

      if (
        responseFamilyCreation.StatusCode == 201 ||
        responseFamilyCreation.StatusCode == 200
      ) {
        const responseFamilies = await familyService.getFamilies();
        const ultimaFamilia = responseFamilies.Response.at(-1);
        const idFamiliaGerado = ultimaFamilia?.id || ultimaFamilia?.id_familia;

        if (!idFamiliaGerado)
          throw new Error("ID da família não encontrado após a criação.");

        const dadosOwnerFamily = {
          id_familia: idFamiliaGerado,
          id_usuario: user.id_usuario,
        };
        await userService.createUserFamily(dadosOwnerFamily);

        sessionStorage.setItem("@FamilySync:family:id", idFamiliaGerado);

        const dispararEmailsEmBackground = async () => {
          try {
            if (formData.membros.length > 0) {
              for (const emailMembro of formData.membros) {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                await userService.addUserFamilyByEmail({
                  email: [emailMembro],
                  id_familia: idFamiliaGerado,
                });
              }
            }
          } catch (err) {
            console.error("Erro no envio em background:", err);
          }
        };

        dispararEmailsEmBackground();

        await refreshUser();

        setIsLoading(false);
        navigate("/dashboard");
      } else {
        setIsLoading(false);
        setErrosCampos({ geral: responseFamilyCreation.message });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleGlobalEnter = (e) => {
      if (
        e.key === "Enter" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
      ) {
        handleConfirmar();
      }
    };
    window.addEventListener("keydown", handleGlobalEnter);
    return () => window.removeEventListener("keydown", handleGlobalEnter);
  }, [formData]);

  return {
    navigate,
    handleCancelar,
    fileInputRef,
    preview,
    isLoading,
    currentEmail,
    setCurrentEmail,
    formData,
    errosCampos,
    setErrosCampos,
    handleFileChange,
    removeImagem,
    handleChange,
    handleKeyDown,
    validarCampo,
    buscarDadosCep,
    handleAddMember,
    handleRemoveMember,
    handleConfirmar,
    formatPhone,
    formatCEP,
  };
};
