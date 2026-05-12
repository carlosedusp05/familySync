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
  chevronDownBrownIcon,
} from "../../assets";

import {
  validateName,
  validateEmail,
  validarCpf,
  validarDataNascimento,
  validatePassword,
} from "../../utils/validators";
import {
  formatCPF,
  cleanCPF,
  formatUserName,
  formatDateForInput,
} from "../../utils/formatters";

import FamilySelector from "../ui/FamilySelector";

import DeleteModal from "../ui/DeleteModal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const hoje = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("@FamilySync:user"));

      if (!storedUser) {
        return navigate("/auth/login");
      }

      setFormData((prev) => ({
        ...prev,
        nome: storedUser.nome || "",
        email: storedUser.email || "",
      }));

      setIsLoading(true);

      try {
        const id_usuario = parseInt(storedUser.id_usuario);

        const [response, familias] = await Promise.all([
          userService.getUserById(id_usuario),
          Promise.resolve([
            { id: 1, nome: "Família Silva" },
            { id: 2, nome: "Família Oliveira" },
            { id: 3, nome: "Família Souza" },
          ]),
        ]);

        const user = response.Response[0];

        setFormData({
          nome: user.nome || "",
          email: user.email || "",
          cpf: formatCPF(user.cpf || ""),
          dataNascimento: formatDateForInput(user.data_nascimento),
          senha: "",
        });

        if (user.foto_perfil) setPreview(user.foto_perfil);

        setFamiliasDisponiveis(familias);
        setFamiliasSelecionadas(user.familias?.map((f) => f.id) || [1]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 100);
      }
    };

    loadData();
  }, [navigate]);

  const validateFieldOnBlur = (id, valor) => {
    if (!editableFields[id]) return;

    let erroMensagem = "";

    switch (id) {
      case "nome":
        erroMensagem = validateName(valor);
        break;
      case "email":
        erroMensagem = validateEmail(valor);
        break;
      case "cpf":
        erroMensagem = validarCpf(valor);
        break;
      case "dataNascimento":
        erroMensagem = validarDataNascimento(valor);
        if (erroMensagem && new Date(valor) > new Date()) {
          setFormData((prev) => ({ ...prev, dataNascimento: hoje }));
        }
        break;
      case "senha":
        if (valor) erroMensagem = validatePassword(valor);
        break;
    }

    setErrosCampos((prev) => ({ ...prev, [id]: erroMensagem }));
  };

  const toggleEdit = (fieldId) => {
    setEditableFields((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }));
    if (editableFields[fieldId]) {
      setErrosCampos((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleUpdate = async () => {
    const erros = {
      nome: validateName(formData.nome),
      email: validateEmail(formData.email),
      cpf: validarCpf(formData.cpf),
      dataNascimento: validarDataNascimento(formData.dataNascimento),
    };

    if (formData.senha) erros.senha = validatePassword(formData.senha);

    Object.keys(erros).forEach((key) => !erros[key] && delete erros[key]);

    if (Object.keys(erros).length > 0) {
      setErrosCampos(erros);
      return;
    }

    setIsLoading(true);
    try {
      const dadosUpdate = {
        ...formData,
        nome: formatUserName(formData.nome),
        cpf: cleanCPF(formData.cpf),
        familias: familiasSelecionadas,
      };

      if (formData.senha) {
        dadosUpdate.senha = CryptoJS.SHA256(formData.senha).toString(
          CryptoJS.enc.Hex,
        );
      } else {
        delete dadosUpdate.senha;
      }

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

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("@FamilySync:user"));
      const id_usuario = parseInt(storedUser.id_usuario);

      await userService.deleteUser(id_usuario);

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
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
          <FamilySelector
            isOpen={isFamiliesOpen}
            toggleOpen={() => setIsFamiliesOpen(!isFamiliesOpen)}
            disponiveis={familiasDisponiveis}
            selecionadas={familiasSelecionadas}
            onSelect={(id) => {
              setFamiliasSelecionadas([id]);
              setIsFamiliesOpen(false);
            }}
          />
        </div>

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
            onClick={() => setIsDeleteModalOpen(true)}
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
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

export default AccountEdit;
