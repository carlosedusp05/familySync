import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import DefaultTextField from "../ui/DefaultTextField";
import FamilySelector from "../ui/FamilySelector";
import DeleteModal from "../ui/DeleteModal";
import PasswordModal from "../ui/PasswordModal";

import { deleteRedIcon } from "../../assets";
import { formatCPF } from "../../utils/formatters";

function AccountEdit({
  navigate,
  formData,
  setFormData,
  familiasDisponiveis,
  familiasSelecionadas,
  isFamiliesOpen,
  setIsFamiliesOpen,
  editableFields,
  isEditing,
  toggleEditingMode,
  errosCampos,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  hoje,
  validateFieldOnBlur,
  handleUpdate,
  removeImagem,
  handleDeleteAccount,
  handleLogout,
  handleSelectFamily,
  preview,
  setPreview,
  setFotoArquivo,
  isPasswordModalOpen,
  setIsPasswordModalOpen,
  passwordData,
  setPasswordData,
  passwordErros,
  setPasswordErros,
  isChangingPassword,
  validatePasswordOnBlur,
  handleUpdatePassword,
}) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const configCamposPrincipais = [
    { id: "nome", placeholder: "Nome", type: "text" },
    { id: "email", placeholder: "E-mail", type: "email" },
    { id: "cpf", placeholder: "CPF", type: "text", maxLength: 14 },
    {
      id: "dataNascimento",
      placeholder: "Data Nascimento",
      type: "date",
      max: hoje,
    },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center relative p-2 sm:p-0">
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 z-50">
        <DefaultButton
          text="Sair da conta"
          logout_image={true}
          onClick={handleLogout}
        />
      </div>

      <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-[24px] sm:rounded-[30px] p-4 sm:p-6 pb-6 sm:pb-8 flex flex-col items-center w-full max-w-[95vw] md:w-142.5 md:max-w-[90vw] max-h-[92%] sm:max-h-[95%] overflow-y-auto shadow-2xl transition-all duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-24 h-24 sm:w-30 sm:h-30 shrink-0 relative rounded-full border-2 border-orange bg-white mb-4 sm:mb-6 mt-12 sm:mt-0">
          {preview ? (
            <img
              src={preview}
              className={`w-full h-full rounded-full object-cover ${isEditing ? "cursor-pointer" : "opacity-90"}`}
              alt="Perfil"
              onClick={() => isEditing && handleButtonClick()}
            />
          ) : (
            <IconPerfil
              is_white_backgroud={true}
              another_size="h-[70%]"
              onClick={() => isEditing && handleButtonClick()}
              className={isEditing ? "cursor-pointer" : ""}
            />
          )}

          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const arquivoSelecionado = e.target.files[0];
                      setPreview(URL.createObjectURL(arquivoSelecionado));
                      setFotoArquivo(arquivoSelecionado);
                    }
                  }}
                />
                <DefaultButton
                  onClick={() => {
                    if (preview) removeImagem();
                    handleButtonClick();
                  }}
                  another_padding={"px-0 pb-1"}
                  another_size={"h-10 w-10 sm:h-12 sm:w-12"}
                  another_text_size={"text-2xl sm:text-3xl"}
                  most_radius={true}
                  text={preview ? "×" : "+"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cabeçalho "Eu" */}
        <div className="w-full flex items-center justify-between px-[2.5%] mb-4 h-auto sm:h-10">
          <h1 className="text-orange text-2xl sm:text-3xl font-medium">Eu</h1>

          <button
            type="button"
            onClick={toggleEditingMode}
            className={`text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all duration-300 shadow-sm ${
              isEditing
                ? "bg-gray-500/20 text-gray-700 hover:bg-gray-500 hover:text-white"
                : "bg-orange/10 text-orange hover:bg-orange hover:text-white"
            }`}
          >
            {isEditing ? "Visualizar Perfil" : "Editar Perfil"}
          </button>
        </div>

        <div className="w-full sm:w-[95%] flex flex-col gap-3">
          {configCamposPrincipais.map((campo) => (
            <div key={campo.id} className="w-full flex flex-col gap-1">
              <DefaultTextField
                variant="profile"
                id={campo.id}
                type={campo.type}
                placeholder={campo.placeholder}
                value={formData[campo.id] || ""}
                max={campo.max}
                hasError={!!errosCampos[campo.id]}
                readOnly={!editableFields[campo.id]}
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
            onSelect={handleSelectFamily}
          />
        </div>

        <div className="w-full sm:w-[95%] bg-white rounded-xl mt-6 shadow-sm overflow-hidden flex flex-col shrink-0">
          <div className="p-4 pb-0">
            <h2 className="text-[#4a2511] font-bold text-lg sm:text-2xl mb-2">
              Configurações avançadas
            </h2>
            <hr className="border-t border-[#4a2511] opacity-30" />
          </div>

          <motion.div
            whileHover={{
              scale: 1.01,
              backgroundColor: "rgba(249, 115, 22, 0.08)",
            }}
            onClick={() => {
              setPasswordErros({});
              setIsPasswordModalOpen(true);
            }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between cursor-pointer group p-3 sm:p-4 border-b border-gray-100 duration-200 ease-out transition-all bg-transparent"
          >
            <div className="flex items-center px-2 sm:px-5">
              <span className="text-orange font-bold text-base sm:text-xl group-hover:tracking-wide transition-all">
                Alterar senha da conta
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.01,
              backgroundColor: "rgba(240, 62, 62, 0.09)",
            }}
            onClick={() => setIsDeleteModalOpen(true)}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between cursor-pointer group p-3 sm:p-4 duration-200 ease-out transition-all bg-transparent"
          >
            <div className="flex items-center gap-3">
              <motion.img
                src={deleteRedIcon}
                alt="Excluir conta"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                variants={{
                  hover: {
                    rotate: [0, -10, 10, -10, 10, 0],
                    transition: { duration: 0.4 },
                  },
                }}
                whileHover="hover"
              />
              <span className="text-[#f03e3e] font-bold text-base sm:text-xl group-hover:tracking-wide transition-all">
                Excluir conta
              </span>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between w-full sm:w-[95%] mt-6 sm:mt-8 gap-3 sm:gap-4 shrink-0">
          <DefaultButton
            text="Cancelar"
            theme={false}
            onClick={() => navigate("/dashboard")}
          />

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full sm:w-auto flex-1"
            >
              <DefaultButton
                text="Confirmar"
                theme={true}
                onClick={handleUpdate}
              />
            </motion.div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        passwordErros={passwordErros}
        setPasswordErros={setPasswordErros}
        loading={isChangingPassword}
        onBlurField={validatePasswordOnBlur}
        onConfirm={handleUpdatePassword}
      />
    </div>
  );
}

export default AccountEdit;
