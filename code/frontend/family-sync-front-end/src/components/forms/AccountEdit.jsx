import { useRef } from "react";
import { motion } from "framer-motion";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import DefaultTextField from "../ui/DefaultTextField";
import FamilySelector from "../ui/FamilySelector";
import DeleteModal from "../ui/DeleteModal";

import { editPencilBrownIcon, deleteRedIcon } from "../../assets";

import { formatCPF } from "../../utils/formatters";

function AccountEdit({
  navigate,
  formData,
  setFormData,
  familiasDisponiveis,
  familiasSelecionadas,
  setFamiliasSelecionadas,
  isFamiliesOpen,
  setIsFamiliesOpen,
  editableFields,
  errosCampos,
  preview,
  setPreview,
  mostrarSenha,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  hoje,
  validateFieldOnBlur,
  toggleEdit,
  handleUpdate,
  removeImagem,
  handleDeleteAccount,
  handleLogout,
}) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
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
      onClickIcon: () => toggleEdit("senha"),
    },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      <div className="absolute top-10 left-10">
        <DefaultButton
          text="Sair da conta"
          logout_image={true}
          onClick={handleLogout}
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
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
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
                onClickIcon={campo.onClickIcon || (() => toggleEdit(campo.id))}
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
