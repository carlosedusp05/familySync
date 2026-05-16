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

export const useAddFamily = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [errosCampos, setErrosCampos] = useState({});

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImagem = () => {
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

    const erroValidacao = validateEmail(currentEmail);
    if (erroValidacao) {
      setErrosCampos((prev) => ({ ...prev, membros: erroValidacao }));
      return;
    }

    if (formData.membros.includes(currentEmail)) {
      setErrosCampos((prev) => ({ ...prev, membros: "E-mail já adicionado" }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      membros: [...prev.membros, currentEmail.toLowerCase()],
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

      const dadosFamily = {
        nome: formData.nomeFamilia.trim(),
        telefone_residencial: formatPhone(formData.telefone),
      };

      const responseCreationFamily =
        await familyService.createFamily(dadosFamily);

      if (
        responseCreationFamily.StatusCode == 201 ||
        responseCreationFamily.StatusCode == 200 ||
        responseCreationFamily.id
      ) {
        const responseFamilies = await familyService.getFamilies();
        const ultimaFamilia = responseFamilies.Response.at(-1);
        const idFamiliaGerado = ultimaFamilia?.id || ultimaFamilia?.id_familia;

        if (!idFamiliaGerado)
          throw new Error("ID da família não encontrado após a criação.");

        const dadosEndereco = {
          id_familia: idFamiliaGerado,
          cep: formData.cep,
          logradouro: formData.logradouro,
          bairro: formData.bairro,
          complemento: formData.complemento || "",
          cidade: formData.cidade,
          estado: formData.uf,
          numero: formData.numero,
        };

        await enderecoService.createEndereco(dadosEndereco);

        const dadosUserFamily = {
          email: user.email,
          id_familia: idFamiliaGerado,
        };

        await userService.addUserFamilyByEmail(dadosUserFamily);

        let i = 0;
        while (formData.membros.length > i) {
          const familyValid = {
            email: formData.membros[i],
            id_familia: idFamiliaGerado,
          };
          await userService.addUserFamilyByEmail(familyValid);
          i++;
        }

        navigate("/dashboard");
      } else {
        setErrosCampos({ geral: responseCreationFamily.message });
      }
    } catch (error) {
      console.log(error);
    } finally {
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
