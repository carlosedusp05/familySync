import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CryptoJS from "crypto-js";

import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import DefaultTextField from "../ui/DefaultTextField";
import LoadingOverlay from "../ui/LoadingOverlay";

import { userService } from "../../services/userService";
import {
  editPencilBrownIcon,
  deleteRedIcon,
  calendarIconForms,
  chevronDownBrownIcon,
} from "../../assets";

function AccountEdit() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    senha: "",
  });

  const [familiasDisponiveis, setFamiliasDisponiveis] = useState([]);
  const [familiasSelecionadas, setFamiliasSelecionadas] = useState([]);
  const [isFamiliesOpen, setIsFamiliesOpen] = useState(false);

  const [editableFields, setEditableFields] = useState({});
  const [errosCampos, setErrosCampos] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const hoje = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem("@FamilySync:user"));
        if (!storedUser) return navigate("/auth/login");

        const id_usuario = parseInt(storedUser.id_usuario);

        const response = await userService.getUserById(id_usuario);

        const user = response.Response;

        console.log(user);

        setFormData({
          nome: user.nome || "",
          email: user.email || "",
          cpf: formatCPF(user.cpf || ""),
          dataNascimento: user.data_nascimento || "",
          senha: "",
        });

        if (user.foto_perfil) setPreview(user.foto_perfil);

        setFamiliasDisponiveis([
          { id: 1, nome: "Família Silva" },
          { id: 2, nome: "Família Oliveira" },
          { id: 3, nome: "Família Souza" },
        ]);

        setFamiliasSelecionadas(user.familias?.map((f) => f.id) || [1]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const formatCPF = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);

  const validarCpf = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    const calc = (q) => {
      const s = cpf
        .split("")
        .slice(0, q - 1)
        .reduce((acc, curr, i) => acc + curr * (q - i), 0);
      const r = (s * 10) % 11;
      return r === 10 ? 0 : r;
    };
    return calc(10) === Number(cpf[9]) && calc(11) === Number(cpf[10]);
  };

  const validateFieldOnBlur = (id, valor) => {
    if (!editableFields[id]) return;

    let erroMensagem = "";

    switch (id) {
      case "nome":
        if (!valor || valor.trim().length < 3 || !isNaN(valor))
          erroMensagem = "Insira um nome válido (mínimo 3 caracteres)";
        break;
      case "email":
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!valor) erroMensagem = "O e-mail é obrigatório";
        else if (!regexEmail.test(valor))
          erroMensagem = "Insira um formato de e-mail válido";
        break;
      case "cpf":
        if (!validarCpf(valor)) erroMensagem = "CPF inválido";
        break;
      case "dataNascimento":
        const dataSelecionada = new Date(valor);
        const dataHoje = new Date();
        if (dataSelecionada > dataHoje) {
          setFormData((prev) => ({ ...prev, dataNascimento: hoje }));
          erroMensagem = "";
        } else if (!valor) {
          erroMensagem = "Data de nascimento é obrigatória";
        }
        break;
      case "senha":
        if (valor) {
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
            erroMensagem =
              "Senha muito fraca (mín. 8 caracteres, maiúsculas, números e símbolos)";
          }
        }
        break;
      default:
        break;
    }

    setErrosCampos((prev) => ({ ...prev, [id]: erroMensagem }));
  };

  const toggleFamily = (id) => {
    setFamiliasSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const toggleEdit = (fieldId) => {
    setEditableFields((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }));
    // Limpa o erro ao fechar o modo de edição para não travar a tela
    if (editableFields[fieldId]) {
      setErrosCampos((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const dadosUpdate = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ""),
        familias: familiasSelecionadas,
      };
      if (formData.senha)
        dadosUpdate.senha = CryptoJS.SHA256(formData.senha).toString();
      await userService.updateUser(dadosUpdate);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const configCampos = [
    {
      id: "nome",
      placeholder: "Nome",
      type: "text",
      src: editPencilBrownIcon,
    },
    {
      id: "email",
      placeholder: "E-mail",
      type: "email",
      src: editPencilBrownIcon,
    },
    {
      id: "cpf",
      placeholder: "CPF",
      type: "text",
      src: editPencilBrownIcon,
      maxLength: 14,
    },
    {
      id: "dataNascimento",
      placeholder: "Data Nascimento",
      type: "date",
      src: editPencilBrownIcon,
      max: hoje,
    },
    {
      id: "senha",
      placeholder: "Nova Senha",
      type: mostrarSenha ? "text" : "password",
      src: editPencilBrownIcon,
      isPassword: true,
      onClickIcon: () => {
        toggleEdit("senha");
        if (!editableFields["senha"]) setMostrarSenha(true);
      },
    },
  ];

  const removeImagem = () => {
    setPreview(null);

    setFileSelecionado(null);
  };

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      {isLoading && <LoadingOverlay />}
      <div className="absolute top-10 left-10">
        <DefaultButton
          text="Sair da conta"
          logout_image={true}
          onClick={() => {
            localStorage.clear();

            navigate("/");
          }}
        />
      </div>

      <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-[30px] p-6 pb-8 flex flex-col items-center w-142.5 max-w-[90vw] shadow-2xl">
        {/* Avatar */}
        <div className="w-30 h-30 relative rounded-full border-2 border-orange bg-white mb-6">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full rounded-full object-cover"
              alt="Perfil"
            />
          ) : (
            <IconPerfil is_white_backgroud={true} another_size="h-70%" />
          )}
          <div className="absolute -bottom-3 -right-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) =>
                setPreview(URL.createObjectURL(e.target.files[0]))
              }
            />
            <DefaultButton
              onClick={preview ? removeImagem : handleButtonClick}
              another_padding={"px-0 pb-1"}
              another_size={"h-12 w-12"}
              another_text_size={"text-3xl"}
              most_radius={true}
              text={preview ? "×" : "+"}
            />
          </div>
        </div>

        <h1 className="text-orange text-3xl font-medium mb-4">Eu</h1>

        <div className="w-[95%] flex flex-col gap-3">
          {configCampos.map((campo) => (
            <div key={campo.id} className="w-full flex flex-col gap-1">
              <DefaultTextField
                variant="profile"
                id={campo.id}
                type={campo.type}
                placeholder={campo.placeholder}
                value={formData[campo.id]}
                src={campo.src}
                max={campo.max}
                isPassword={campo.isPassword}
                hasError={!!errosCampos[campo.id]}
                readOnly={!editableFields[campo.id]}
                onClickIcon={() => toggleEdit(campo.id)}
                onChange={(e) => {
                  let val = e.target.value;
                  if (campo.id === "cpf") val = formatCPF(val);
                  setFormData({ ...formData, [campo.id]: val });
                }}
                onBlur={(e) => validateFieldOnBlur(campo.id, e.target.value)}
              />
              {errosCampos[campo.id] && (
                <span className="text-red-500 text-xs ml-4 font-bold">
                  {errosCampos[campo.id]}
                </span>
              )}
            </div>
          ))}

          {/* Seção de Famílias Corrigida */}
          <div className="w-full bg-white rounded-lg shadow-sm mt-2 overflow-hidden">
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsFamiliesOpen(!isFamiliesOpen)}
            >
              <h3 className="text-[#4a2511] font-bold text-xl">
                Minhas Famílias
              </h3>
              <motion.img
                src={chevronDownBrownIcon}
                animate={{ rotate: isFamiliesOpen ? 180 : 0 }}
                className="w-8 h-8 object-contain"
              />
            </div>

            <AnimatePresence>
              {isFamiliesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3"
                >
                  {familiasDisponiveis.map((fam) => (
                    <div
                      key={fam.id}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => toggleFamily(fam.id)}
                    >
                      <div
                        className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all ${
                          familiasSelecionadas.includes(fam.id)
                            ? "bg-orange border-orange"
                            : "border-[#4a2511]/30"
                        }`}
                      >
                        {familiasSelecionadas.includes(fam.id) && (
                          <span className="text-white text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[#4a2511] font-bold text-lg">
                        {fam.nome}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Configurações Avançadas */}

        <div className="w-[95%] bg-white rounded-xl mt-6 shadow-sm overflow-hidden">
          <div className="p-4 pb-0">
            <h2 className="text-[#4a2511] font-bold text-2xl mb-2">
              Configurações avançadas
            </h2>

            <hr className="border-t border-[#4a2511] opacity-30" />
          </div>

          <motion.div
            whileHover={{
              scale: 1.01,

              backgroundColor: "rgba(240, 62, 62, 0.09)",
            }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between cursor-pointer group p-4 duration-200 ease-out transition-all bg-transparent"
          >
            <div className="flex items-center gap-3">
              <motion.img
                src={deleteRedIcon}
                alt="Excluir conta"
                className="w-10 h-10 object-contain"
                variants={{
                  hover: {
                    rotate: [0, -10, 10, -10, 10, 0],

                    transition: { duration: 0.4 },
                  },
                }}
                whileHover="hover"
              />

              <span className="text-[#f03e3e] font-bold text-xl group-hover:tracking-wide transition-all">
                Excluir conta
              </span>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between w-[95%] mt-8 gap-4">
          <DefaultButton
            text="Cancelar"
            theme={false}
            onClick={() => navigate("/dashboard")}
          />
          <DefaultButton text="Confirmar" theme={true} onClick={handleUpdate} />
        </div>
      </div>
    </div>
  );
}

export default AccountEdit;
