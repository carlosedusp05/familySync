import DefaultButton from "../../ui/DefaultButton";
import InputWhite from "../../ui/InputWhite";
import { pencilTerracotaIcon, trashIconRed } from "../../../assets";

function FamilyDetails({
  preview,
  handleButtonClick,
  removeImagem,
  fileInputRef,
  handleFileChange,
  isEditing,
  formData,
  familyData,
  toggleEditMode,
  handleInputChange,
  saveFamilyData,
  leaveFamily,
}) {
  return (
    <div className="flex-1 bg-[#fdf8ed] rounded-[40px] shadow-sm p-10 flex flex-col gap-8 relative">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            name="nome"
            value={formData.nome || ""}
            onChange={handleInputChange}
            className="text-3xl font-bold text-black bg-transparent border-b-2 border-orange/40 focus:border-orange outline-none w-full mr-4"
            placeholder="Nome da Família"
          />
        ) : (
          <h1 className="text-3xl font-bold text-black">
            {familyData.nome || "Carregando..."}
          </h1>
        )}

        <div className="flex gap-4 items-center">
          <img
            src={trashIconRed}
            alt="Deletar Família"
            className="w-8 h-8 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
      <div
        className={`relative w-full h-56 bg-gray-300 rounded-3xl overflow-hidden group ${
          isEditing ? "cursor-pointer" : "cursor-default opacity-80"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Capa da Família"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={handleButtonClick}
          />
        ) : (
          <div className="w-full h-full bg-orange/80 flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              Adicionar Foto de Capa
            </span>
          </div>
        )}

        {isEditing && (
          <div
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm text-gray-800 shadow-sm cursor-pointer"
            onClick={preview ? removeImagem : handleButtonClick}
          >
            Alterar Foto
          </div>
        )}

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
          <InputWhite
            text={"CEP"}
            name="cep"
            value={formData.cep}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"flex-1"}
          />
          <InputWhite
            text={"Cidade"}
            name="cidade"
            value={formData.cidade}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"flex-1"}
          />
        </div>

        <div className="flex gap-4">
          <InputWhite
            text={"Estado"}
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"flex-1"}
          />
          <InputWhite
            text={"Bairro"}
            name="bairro"
            value={formData.bairro}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"flex-1"}
          />
        </div>

        <InputWhite
          text={"Logradouro"}
          name="logradouro"
          value={formData.logradouro}
          onChange={handleInputChange}
          disabled={!isEditing}
          styleFlex={"w-full"}
        />

        <div className="flex gap-4">
          <InputWhite
            text={"Número"}
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"flex-1"}
          />
          <InputWhite
            text={"Complemento"}
            name="complemento"
            value={formData.complemento}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"flex-1"}
          />
        </div>
        <InputWhite
          text={"Telefone de Contato"}
          name="telefone"
          value={formData.telefone || ""}
          onChange={handleInputChange}
          disabled={!isEditing}
          styleFlex={"w-full"}
        />
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-4">
        {isEditing ? (
          <DefaultButton
            text="Salvar Alterações"
            another_size="w-full"
            another_padding="py-4"
            another_text_size="text-xl"
            onClick={saveFamilyData}
          />
        ) : (
          <DefaultButton
            text="Editar Informações"
            another_size="w-full"
            another_padding="py-4"
            another_text_size="text-xl"
            onClick={toggleEditMode}
          />
        )}

        <button
          onClick={leaveFamily}
          className="w-full py-4 rounded-2xl bg-gray-200/60 text-red-600 font-bold text-xl flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all"
        >
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
  );
}

export default FamilyDetails;
