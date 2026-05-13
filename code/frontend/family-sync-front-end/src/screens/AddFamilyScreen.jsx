import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";
import { familyIcon } from "../assets/index";
import DefaultButton from "../components/ui/DefaultButton";
import InputAddFamily from "../components/ui/InputAddFamily";
import SelectAddFamily from "../components/ui/SelectAddFamily";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateName, validatePhone } from "../utils/validators.js";
import {
  formatPhone,
  formatCEP,
  cleanCEP,
  formatUserName,
} from "../utils/formatters.js";
import { viaCepService } from "../services/viaCepService.jsx";
import { familyService } from "../services/familyService.jsx";
import { enderecoService } from "../services/enderecoService.jsx";
import { userService } from "../services/userService.jsx";
import LoadingOverlay from "../components/ui/LoadingOverlay.jsx";

function AddFamilyScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    nomeUsuario: "",
  });

  const [errosCampos, setErrosCampos] = useState({});

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
    "nomeUsuario",
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
        if (!valor && id !== "complemento" && id !== "nomeUsuario")
          mensagem = "Campo obrigatório";
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
        handleConfirmar();
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

  const handleConfirmar = async function () {
    const novosErros = {};
    focusOrder.forEach((id) => {
      const erro = validarCampo(id, formData[id]);
      if (erro) novosErros[id] = erro;
    });

    if (Object.keys(novosErros).length > 0) return;

    setIsLoading(true);
    try {
      const userSession = localStorage.getItem("@FamilySync:user");
      const user = userSession ? JSON.parse(userSession) : null;

      const dadosFamily = {
        nome: formData.nomeFamilia.trim(),
        telefone_residencial: formatPhone(formData.telefone),
      };

      const responseCreationFamily =
        await familyService.createFamily(dadosFamily);

      console.log(responseCreationFamily);
      if (
        responseCreationFamily.StatusCode == 201 ||
        responseCreationFamily.StatusCode == 200 ||
        responseCreationFamily.id
      ) {
        const responseFamilies = await familyService.getFamilies();

        console.log(responseFamilies);

        const ultimaFamilia = responseFamilies.Response.at(-1);
        const idFamiliaGerado = ultimaFamilia?.id || ultimaFamilia?.id_familia;

        console.log(idFamiliaGerado);

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

        console.log(formData);

        await enderecoService.createEndereco(dadosEndereco);

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

  return (
    <MainLayout>
      <div className="w-full h-full flex justify-center items-center">
        {isLoading && <LoadingOverlay />}
        <LargeCard
          color={"bg-yellow-light"}
          p={"px-50"}
          size={"h-[80%] w-[75%]"}
        >
          <div className="h-full w-full flex items-center justify-between">
            <div className="w-110 h-110 relative rounded-full border-2 border-orange flex items-center justify-center bg-white">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <img className="h-[60%]" src={familyIcon} alt="Family" />
              )}
              <div className="absolute bottom-3 right-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <DefaultButton
                  onClick={
                    preview ? removeImagem : () => fileInputRef.current.click()
                  }
                  another_padding={"px-0 pb-2"}
                  another_size={"h-25 w-25"}
                  another_text_size={"text-7xl"}
                  most_radius={true}
                  text={preview ? "×" : "+"}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 w-[55%]">
              <div className="flex flex-col gap-3">
                <InputAddFamily
                  id="nomeFamilia"
                  placeholder="Nome da Família"
                  w="w-full"
                  value={formData.nomeFamilia}
                  onChange={(e) => handleChange("nomeFamilia", e.target.value)}
                  onBlur={() =>
                    validarCampo("nomeFamilia", formData.nomeFamilia)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "nomeFamilia")}
                  error={errosCampos.nomeFamilia}
                />

                <InputAddFamily
                  id="telefone"
                  placeholder="Telefone Residencial"
                  w="w-full"
                  value={formData.telefone}
                  onChange={(e) => {
                    const formatado = formatPhone(e.target.value);
                    handleChange("telefone", formatado);
                  }}
                  onBlur={() => validarCampo("telefone", formData.telefone)}
                  onKeyDown={(e) => handleKeyDown(e, "telefone")}
                  error={errosCampos.telefone}
                />

                <div className="flex gap-3">
                  <SelectAddFamily
                    id="uf"
                    w="w-[30%]"
                    value={formData.uf}
                    onChange={(e) => handleChange("uf", e.target.value)}
                    onBlur={() => validarCampo("uf", formData.uf)}
                    onKeyDown={(e) => handleKeyDown(e, "uf")}
                    error={errosCampos.uf}
                  />
                  <InputAddFamily
                    id="cep"
                    placeholder="CEP"
                    w="w-[70%]"
                    value={formData.cep}
                    onChange={(e) => {
                      const formatado = formatCEP(e.target.value);
                      handleChange("cep", formatado);
                    }}
                    onBlur={() => {
                      validarCampo("cep", formData.cep);
                      buscarDadosCep(formData.cep);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, "cep")}
                    error={errosCampos.cep}
                  />
                </div>

                <div className="flex gap-3">
                  <InputAddFamily
                    id="cidade"
                    placeholder="Cidade"
                    w="w-[60%]"
                    value={formData.cidade}
                    onChange={(e) => handleChange("cidade", e.target.value)}
                    onBlur={() => validarCampo("cidade", formData.cidade)}
                    onKeyDown={(e) => handleKeyDown(e, "cidade")}
                    error={errosCampos.cidade}
                  />
                  <InputAddFamily
                    id="bairro"
                    placeholder="Bairro"
                    w="w-[40%]"
                    value={formData.bairro}
                    onChange={(e) => handleChange("bairro", e.target.value)}
                    onBlur={() => validarCampo("bairro", formData.bairro)}
                    onKeyDown={(e) => handleKeyDown(e, "bairro")}
                    error={errosCampos.bairro}
                  />
                </div>

                <InputAddFamily
                  id="logradouro"
                  placeholder="Logradouro"
                  w="w-full"
                  value={formData.logradouro}
                  onChange={(e) => handleChange("logradouro", e.target.value)}
                  onBlur={() => validarCampo("logradouro", formData.logradouro)}
                  onKeyDown={(e) => handleKeyDown(e, "logradouro")}
                  error={errosCampos.logradouro}
                />

                <div className="flex gap-3">
                  <InputAddFamily
                    id="numero"
                    placeholder="Número"
                    w="w-[40%]"
                    value={formData.numero}
                    onChange={(e) => handleChange("numero", e.target.value)}
                    onBlur={() => validarCampo("numero", formData.numero)}
                    onKeyDown={(e) => handleKeyDown(e, "numero")}
                    error={errosCampos.numero}
                  />
                  <InputAddFamily
                    id="complemento"
                    placeholder="Complemento"
                    w="w-[60%]"
                    value={formData.complemento}
                    onChange={(e) =>
                      handleChange("complemento", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, "complemento")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="w-full bg-brown-dark rounded-2xl flex px-5 py-3 h-20 gap-3">
                  <input
                    id="nomeUsuario"
                    type="text"
                    placeholder="Nome do usuário"
                    value={formData.nomeUsuario}
                    onChange={(e) =>
                      handleChange("nomeUsuario", e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, "nomeUsuario")}
                    className="py-2 px-5 bg-orange text-brown-dark placeholder:text-brown-dark/70 rounded-2xl w-[60%] flex items-center text-xl sm:text-2xl font-bold focus:outline-none"
                  />
                  <DefaultButton
                    text="Convidar"
                    another_text_size={"text-2xl"}
                    another_size={"w-[40%]"}
                  />
                </div>
                <div className="w-full flex justify-between">
                  <DefaultButton
                    text="Cancelar"
                    theme={false}
                    another_size={"w-[45%]"}
                    another_text_size={"text-2xl"}
                    onClick={() => navigate(-1)}
                  />
                  <DefaultButton
                    text="Confirmar"
                    theme={true}
                    another_size={"w-[45%]"}
                    another_text_size={"text-2xl"}
                    onClick={handleConfirmar}
                  />
                </div>
              </div>
            </div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default AddFamilyScreen;
