import MainLayout from "../layouts/MainLayout";
import DefaultButton from "../components/ui/DefaultButton";
import InputWhite from "../components/ui/InputWhite";
import {
  pencilTerracotaIcon,
  trashIconRed,
  eyeMostOrange,
  settingsIcon,
  settingsOrange,
  eyeWhite,
} from "../assets";
import { useRef, useState } from "react";

function ManageFamily() {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileSelecionado, setFileSelecionado] = useState(null);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isHoveredSettings, setIsHoveredSettings] = useState(false);
  const [isHoveredView, setIsHoveredView] = useState(false);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFileSelecionado(file);

    const reader = new FileReader();

    reader.onloadend = (event) => {
      setPreview(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImagem = () => {
    setPreview(null);

    setFileSelecionado(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const familiars = [
    {
      id: 1,
      name: "João Pedro Silva",
      degree_of_relatives: "Pai",
      isMe: false,
    },
    { id: 2, name: "Maria Alice", degree_of_relatives: "Mãe", isMe: false },
    { id: 3, name: "Lucas Gabriel", degree_of_relatives: "Filho", isMe: true },
    { id: 4, name: "Ana Beatriz", degree_of_relatives: "Filha", isMe: false },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-10 h-full">
        <div className="w-[95%] max-w-350 h-full flex gap-8">
          <div className="flex-1 bg-white rounded-[40px] shadow-sm p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-black">
                Membros ({familiars.length})
              </h1>
            </div>

            <div className="bg-[#fdf8ed] rounded-2xl p-5 flex flex-col gap-3 border border-orange/20">
              <span className="font-bold text-gray-800">
                Convidar Novo Membro
              </span>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Digite e-mail ou nome de usuário..."
                  className="flex-1 h-12 bg-white rounded-xl border border-gray-200 px-4 text-gray-700 outline-none focus:border-orange"
                />
                <DefaultButton
                  text="Enviar Convite"
                  another_size="w-auto px-6 h-12"
                  another_padding="py-0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {familiars.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${member.isMe ? "bg-orange/10 border-orange/30" : "bg-white border-gray-100"} relative shadow-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${member.name}&background=random`}
                        alt={member.name}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.degree_of_relatives}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {member.isMe && (
                      <span className="bg-orange/20 text-orange px-3 py-1 rounded-lg text-sm font-bold">
                        Você
                      </span>
                    )}

                    <button
                      onClick={() => toggleMenu(member.id)}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-xl font-bold leading-none pb-2">
                        ...
                      </span>
                    </button>

                    {activeMenuId === member.id && (
                      <div className="absolute right-14 top-14 bg-white border border-gray-200 shadow-lg rounded-xl p-2 w-56 z-10 flex flex-col gap-1">
                        <button
                          className="flex items-center gap-3 px-4 py-3 hover:bg-orange/90 hover:text-white rounded-lg text-left text-sm text-orange font-semibold transition-colors"
                          onMouseEnter={() => setIsHoveredSettings(true)}
                          onMouseLeave={() => setIsHoveredSettings(false)}
                        >
                          <img
                            src={
                              isHoveredSettings ? settingsIcon : settingsOrange
                            }
                            alt="Visualizar perfil"
                            className="h-6 w-6"
                          />
                          <h1>Gerenciar Permissões</h1>
                        </button>
                        <button
                          className="flex items-center gap-3 px-4 py-3 hover:bg-orange/90 hover:text-white rounded-lg text-left text-orange text-sm font-semibold transition-colors"
                          onMouseEnter={() => setIsHoveredView(true)}
                          onMouseLeave={() => setIsHoveredView(false)}
                        >
                          <img
                            src={isHoveredView ? eyeWhite : eyeMostOrange}
                            alt="Visualizar perfil"
                            className="h-6 w-6"
                          />
                          <h1>Visualizar Perfil</h1>
                        </button>
                        {!member.isMe && (
                          <button className="flex items-center gap-3 px-4 py-3 hover:bg-red/50 hover:text-white rounded-lg text-left text-red-600 text-sm font-semibold transition-colors">
                            <img
                              src={trashIconRed}
                              alt="Delete Membro"
                              className="h-6 w-6"
                            />
                            <h1>Remover Membro</h1>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#fdf8ed] rounded-[40px] shadow-sm p-10 flex flex-col gap-8 relative">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-black">
                Dados da Família Silva
              </h1>
              <img
                src={pencilTerracotaIcon}
                alt="Editar"
                className="w-8 h-8 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
              />

              <img
                src={trashIconRed}
                alt="Delete Familia"
                className="w-8 h-8 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="relative w-full h-56 bg-gray-300 rounded-3xl overflow-hidden group cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="Capa da Família"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={handleButtonClick}
                />
              ) : (
                <div className="w-full h-full bg-orange/20 flex items-center justify-center">
                  <span className="text-orange/50 font-bold text-xl">
                    Adicionar Foto de Capa
                  </span>
                </div>
              )}

              <div
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm text-gray-800 shadow-sm"
                onClick={preview ? removeImagem : handleButtonClick}
              >
                📷 Alterar Foto
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <InputWhite text={"CEP"} styleFlex={"flex-1"} />
                <InputWhite text={"Cidade"} styleFlex={"flex-1"} />
              </div>

              <div className="flex gap-4">
                <InputWhite text={"Estado"} styleFlex={"flex-1"} />
                <InputWhite text={"Bairro"} styleFlex={"flex-1"} />
              </div>

              <InputWhite text={"Logradouro"} styleFlex={"w-full"} />

              <div className="flex gap-4">
                <InputWhite text={"Número"} styleFlex={"flex-1"} />
                <InputWhite text={"Complemento"} styleFlex={"flex-1"} />
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4 pt-4">
              <DefaultButton
                text="Salvar Alterações"
                another_size="w-full"
                another_padding="py-4"
                another_text_size="text-xl"
              />
              <button className="w-full py-4 rounded-2xl bg-gray-200/60 text-red-600 font-bold text-xl flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sair desta Família
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ManageFamily;
