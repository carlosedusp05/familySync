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
  openLeaveModal,
  openDeleteFamilyModal,
  // 👇 Novas propriedades recebidas do useManageFamily
  isCurrentUserAdmin,
  minhasPermissoes,
}) {
  return (
    <div className="flex-1 bg-[#fdf8ed] rounded-[2rem] shadow-sm p-5 sm:p-7 flex flex-col gap-4 relative">
      <div className="flex items-center justify-between gap-4">
        {isEditing ? (
          <input
            type="text"
            name="nome"
            value={formData.nome || ""}
            onChange={handleInputChange}
            className="text-xl sm:text-2xl font-bold text-black bg-transparent border-b-2 border-orange/40 focus:border-orange outline-none w-full mr-4"
            placeholder="Nome da Família"
          />
        ) : (
          <h1 className="text-xl sm:text-2xl font-bold text-black truncate">
            {familyData.nome || "Carregando..."}
          </h1>
        )}
        <div className="flex gap-3 items-center shrink-0">
          {/* 👇 SÓ ADMINS PODEM VER A OPÇÃO DE EXCLUIR A FAMÍLIA */}
          {isCurrentUserAdmin && (
            <img
              src={trashIconRed}
              alt="Deletar Família"
              onClick={openDeleteFamilyModal}
              className="w-6 h-6 sm:w-7 sm:h-7 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
            />
          )}
        </div>
      </div>

      <div className="w-full flex justify-center my-1 sm:my-2">
        <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36">
          <div
            className={`w-full h-full rounded-full border-2 border-orange flex items-center justify-center bg-gray-200 overflow-hidden relative shadow-sm ${
              isEditing
                ? "cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-[#E8592A] hover:shadow-lg hover:shadow-orange/30"
                : "cursor-default opacity-80"
            }`}
            onClick={isEditing ? handleButtonClick : undefined}
          >
            {preview ? (
              <img
                src={preview}
                alt="Foto da Família"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-orange/80 flex items-center justify-center p-2 text-center">
                <span className="text-white font-bold text-xs sm:text-sm leading-tight">
                  Adicionar
                  <br />
                  Foto
                </span>
              </div>
            )}
          </div>

          {isEditing && (
            <div
              className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 z-10 bg-white rounded-full p-2 shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                preview ? removeImagem() : handleButtonClick();
              }}
              title={preview ? "Remover Foto" : "Alterar Foto"}
            >
              <img
                src={preview ? trashIconRed : pencilTerracotaIcon}
                alt={preview ? "Remover" : "Editar"}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
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
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-3">
          <InputWhite
            text={"CEP"}
            name="cep"
            value={formData.cep}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"w-[40%] sm:flex-1"}
          />
          <InputWhite
            text={"Cidade"}
            name="cidade"
            value={formData.cidade}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"w-[60%] sm:flex-1"}
          />
        </div>

        <div className="flex flex-row gap-3">
          <InputWhite
            text={"Estado"}
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"w-[40%] sm:flex-1"}
          />
          <InputWhite
            text={"Bairro"}
            name="bairro"
            value={formData.bairro}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"w-[60%] sm:flex-1"}
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

        <div className="flex flex-row gap-3">
          <InputWhite
            text={"Número"}
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"w-[40%] sm:flex-1"}
          />
          <InputWhite
            text={"Complemento"}
            name="complemento"
            value={formData.complemento}
            onChange={handleInputChange}
            disabled={!isEditing}
            styleFlex={"w-[60%] sm:flex-1"}
          />
        </div>

        <InputWhite
          text={"Telefone"}
          name="telefone"
          value={formData.telefone || ""}
          onChange={handleInputChange}
          disabled={!isEditing}
          styleFlex={"w-full"}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        {isEditing ? (
          <div className="flex gap-3 flex-col sm:flex-row">
            <DefaultButton
              text="Cancelar"
              another_color="bg-gray-200"
              another_text_color="text-gray-700 hover:text-black"
              another_size="w-full"
              another_padding="py-2.5"
              another_text_size="text-base"
              onClick={toggleEditMode}
            />
            <DefaultButton
              text="Salvar Alterações"
              another_size="w-full"
              another_padding="py-2.5"
              another_text_size="text-base"
              onClick={saveFamilyData}
            />
          </div>
        ) : (
          /* 👇 SÓ MOSTRA O BOTÃO DE EDIÇÃO SE TIVER PERMISSÃO DE ALTERAR INFORMAÇÕES */
          minhasPermissoes?.alterar_informacoes && (
            <DefaultButton
              text="Editar Informações"
              another_size="w-full"
              another_padding="py-2.5"
              another_text_size="text-base"
              onClick={toggleEditMode}
            />
          )
        )}

        <button
          onClick={openLeaveModal}
          className="w-full py-2.5 rounded-xl bg-gray-200/60 text-red-600 font-bold text-base flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all"
        >
          <svg
            className="w-4 h-4"
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
