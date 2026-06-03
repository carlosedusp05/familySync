import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DefaultTextField from "./DefaultTextField";
import DefaultButton from "./DefaultButton";
import { eyeIcon, closedEye } from "../../assets";

function PasswordModal({
  isOpen,
  onClose,
  passwordData,
  setPasswordData,
  passwordErros,
  setPasswordErros,
  loading,
  onBlurField,
  onConfirm,
}) {
  const [mostrarSenhaAntiga, setMostrarSenhaAntiga] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === "Enter") {
        const target = e.target.tagName;
        if (target !== "BUTTON") {
          e.preventDefault();
          onConfirm();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, passwordData, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col w-full max-w-md shadow-2xl relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange to-[#8a4522]" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-orange transition-colors rounded-full p-2 hover:bg-orange/10 focus:outline-none"
              aria-label="Fechar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center mb-6 mt-2">
              <div className="w-14 h-14 bg-orange/10 rounded-full flex items-center justify-center mb-3 border border-orange/20">
                <span className="text-2xl select-none">🔐</span>
              </div>
              <h2 className="text-[#4a2511] text-2xl md:text-3xl font-bold">
                Alterar Senha
              </h2>
              <p className="text-gray-500 text-sm mt-1 max-w-[280px]">
                Crie uma nova senha forte para manter sua conta do FamilySync
                segura.
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <div className="w-full flex flex-col gap-1">
                <DefaultTextField
                  variant="profile"
                  placeholder="Senha Atual"
                  value={passwordData.senhaAnterior || ""}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      senhaAnterior: e.target.value,
                    });
                    if (passwordErros?.senhaAnterior) {
                      setPasswordErros((prev) => ({
                        ...prev,
                        senhaAnterior: "",
                      }));
                    }
                  }}
                  onBlur={(e) =>
                    onBlurField && onBlurField("senhaAnterior", e.target.value)
                  }
                  type={mostrarSenhaAntiga ? "text" : "password"}
                  src={mostrarSenhaAntiga ? eyeIcon : closedEye}
                  alt="Alternar Visibilidade"
                  isPassword={true}
                  hasError={!!passwordErros?.senhaAnterior}
                  maxLength={100}
                  onClickIcon={() => setMostrarSenhaAntiga(!mostrarSenhaAntiga)}
                />
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${passwordErros?.senhaAnterior ? "max-h-10 opacity-100 mt-0.5" : "max-h-0 opacity-0"}`}
                >
                  <span className="text-red-500 text-xs font-bold ml-2">
                    {passwordErros?.senhaAnterior}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 my-1 px-2">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">
                  Nova Credencial
                </span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="w-full flex flex-col gap-1">
                <DefaultTextField
                  variant="profile"
                  placeholder="Nova Senha"
                  value={passwordData.novaSenha || ""}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      novaSenha: e.target.value,
                    });
                    if (passwordErros?.novaSenha) {
                      setPasswordErros((prev) => ({ ...prev, novaSenha: "" }));
                    }
                  }}
                  onBlur={(e) =>
                    onBlurField && onBlurField("novaSenha", e.target.value)
                  }
                  type={mostrarNovaSenha ? "text" : "password"}
                  src={mostrarNovaSenha ? eyeIcon : closedEye}
                  alt="Alternar Visibilidade"
                  isPassword={true}
                  hasError={!!passwordErros?.novaSenha}
                  maxLength={100}
                  onClickIcon={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                />
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${passwordErros?.novaSenha ? "max-h-10 opacity-100 mt-0.5" : "max-h-0 opacity-0"}`}
                >
                  <span className="text-red-500 text-xs font-bold ml-2">
                    {passwordErros?.novaSenha}
                  </span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-1">
                <DefaultTextField
                  variant="profile"
                  placeholder="Confirmar Nova Senha"
                  value={passwordData.confirmarNovaSenha || ""}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      confirmarNovaSenha: e.target.value,
                    });
                    if (passwordErros?.confirmarNovaSenha) {
                      setPasswordErros((prev) => ({
                        ...prev,
                        confirmarNovaSenha: "",
                      }));
                    }
                  }}
                  onBlur={(e) =>
                    onBlurField &&
                    onBlurField("confirmarNovaSenha", e.target.value)
                  }
                  type={mostrarConfirmar ? "text" : "password"}
                  src={mostrarConfirmar ? eyeIcon : closedEye}
                  alt="Alternar Visibilidade"
                  isPassword={true}
                  hasError={!!passwordErros?.confirmarNovaSenha}
                  maxLength={100}
                  onClickIcon={() => setMostrarConfirmar(!mostrarConfirmar)}
                />
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out w-full flex ${passwordErros?.confirmarNovaSenha ? "max-h-10 opacity-100 mt-0.5" : "max-h-0 opacity-0"}`}
                >
                  <span className="text-red-500 text-xs font-bold ml-2">
                    {passwordErros?.confirmarNovaSenha}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full justify-between gap-3 mt-6 pt-5 border-t border-gray-100">
              <div className="w-1/2">
                <DefaultButton
                  text="Cancelar"
                  theme={false}
                  onClick={onClose}
                  disabled={loading}
                />
              </div>
              <div className="w-1/2">
                <DefaultButton
                  text={loading ? "Salvando..." : "Salvar"}
                  theme={true}
                  onClick={onConfirm}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default PasswordModal;
