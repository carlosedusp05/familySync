import MainLayout from "../../../layouts/MainLayout.jsx";
import LargeCard from "../../ui/LargeCard.jsx";
import { familyIcon } from "../../../assets";
import DefaultButton from "../../ui/DefaultButton";
import InputAddFamily from "./InputAddFamily.jsx";
import SelectAddFamily from "./SelectAddFamily.jsx";
import LoadingOverlay from "../../ui/LoadingOverlay.jsx";
import InputEmailMembers from "./InputEmailMembers.jsx";

function AddFamilyView({
  navigate,
  fileInputRef,
  preview,
  isLoading,
  currentEmail,
  setCurrentEmail,
  formData,
  errosCampos,
  setErrosCampos,
  handleFileChange,
  removeImagem,
  handleChange,
  handleKeyDown,
  validarCampo,
  buscarDadosCep,
  handleAddMember,
  handleRemoveMember,
  handleConfirmar,
  formatPhone,
  formatCEP,
}) {
  return (
    <MainLayout>
      <div className="w-full h-full flex justify-center items-center">
        {isLoading && <LoadingOverlay />}
        <LargeCard
          color={"bg-yellow-light"}
          p={"px-50"}
          size={"h-[85%] w-[75%]"}
        >
          <div className="h-full w-full flex items-center justify-between">
            <div className="w-110 h-110 relative rounded-full border-2 border-orange flex items-center justify-center bg-white shrink-0">
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

              <div className="flex flex-col gap-3">
                <InputEmailMembers
                  membros={formData.membros}
                  currentEmail={currentEmail}
                  setCurrentEmail={setCurrentEmail}
                  handleAddMember={handleAddMember}
                  handleRemoveMember={handleRemoveMember}
                  error={errosCampos.membros}
                  setErrosCampos={setErrosCampos}
                />

                <div className="w-full flex justify-between mt-2">
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

export default AddFamilyView;
