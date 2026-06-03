import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  handleSelectFamily,
  isPasswordModalOpen,
  setIsPasswordModalOpen,
  passwordData,
  setPasswordData,
  errosSenhaModal,
  handleUpdatePassword,
  preview,
  setPreview,
  setFotoArquivo,
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
      isPasswordTrigger: true,
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
              onClick={handleButtonClick}
            />
          ) : (
            <IconPerfil
              is_white_backgroud={true}
              another_size="h-70%"
              onClick={handleButtonClick}
            />
          )}
          <div className="absolute -bottom-3 -right-3">
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
              {/* SE FOR O GATILHO DA SENHA, RENDERIZA O BOTÃO */}
              {campo.isPasswordTrigger ? (
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between bg-white/70 border border-transparent rounded-2xl px-5 py-3 hover:bg-orange/10 hover:border-orange/30 transition-all duration-300 shadow-sm group mt-1"
                >
                  <span className="text-gray-400 font-medium tracking-[0.2em] text-lg group-hover:text-orange transition-colors mt-1">
                    ••••••••••••
                  </span>
                  <span className="bg-orange text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    Alterar Senha
                  </span>
                </button>
              ) : (
                <>
                  <DefaultTextField
                    variant="profile"
                    id={campo.id}
                    type={campo.type}
                    placeholder={campo.placeholder}
                    value={formData[campo.id]}
                    src={campo.src}
                    max={campo.max}
                    hasError={!!errosCampos[campo.id]}
                    readOnly={!editableFields[campo.id]}
                    onClickIcon={
                      campo.onClickIcon || (() => toggleEdit(campo.id))
                    }
                    onChange={(e) => {
                      let val = e.target.value;
                      if (campo.id === "cpf") val = formatCPF(val);
                      setFormData({ ...formData, [campo.id]: val });
                    }}
                    onBlur={(e) =>
                      validateFieldOnBlur(campo.id, e.target.value)
                    }
                  />
                  {errosCampos[campo.id] && (
                    <span className="text-red-500 text-xs ml-4 font-bold">
                      {errosCampos[campo.id]}
                    </span>
                  )}
                </>
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

      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-5 relative m-4"
            >
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold transition-colors"
              >
                ×
              </button>

              <div>
                <h3 className="text-2xl font-bold text-[#4a2511]">
                  Alterar Senha
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Para sua segurança, informe a senha atual.
                </p>
              </div>

              {errosSenhaModal?.geral && (
                <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100">
                  {errosSenhaModal.geral}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    value={passwordData.senhaAnterior}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        senhaAnterior: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange transition-all placeholder:text-gray-400"
                    placeholder="Sua senha atual"
                  />
                  {errosSenhaModal?.senhaAnterior && (
                    <span className="text-red-500 text-xs font-bold ml-1">
                      {errosSenhaModal.senhaAnterior}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={passwordData.novaSenha}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        novaSenha: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange transition-all placeholder:text-gray-400"
                    placeholder="Crie uma nova senha"
                  />
                  {errosSenhaModal?.novaSenha && (
                    <span className="text-red-500 text-xs font-bold ml-1">
                      {errosSenhaModal.novaSenha}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmarNovaSenha}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        confirmarNovaSenha: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange transition-all placeholder:text-gray-400"
                    placeholder="Repita a nova senha"
                  />
                  {errosSenhaModal?.confirmarNovaSenha && (
                    <span className="text-red-500 text-xs font-bold ml-1">
                      {errosSenhaModal.confirmarNovaSenha}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-between mt-4">
                <DefaultButton
                  text="Cancelar"
                  theme={false}
                  onClick={() => setIsPasswordModalOpen(false)}
                />
                <DefaultButton
                  text="Salvar Senha"
                  theme={true}
                  onClick={handleUpdatePassword}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccountEdit;
