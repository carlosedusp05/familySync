import { useEffect } from "react";
import { familyIcon } from "../../../assets";
import DefaultButton from "../../ui/DefaultButton";
import InputAddFamily from "./InputAddFamily.jsx";
import SelectAddFamily from "./SelectAddFamily.jsx";
import InputEmailMembers from "./InputEmailMembers.jsx";
import LargeCard from "../../ui/LargeCard.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

function AddFamilyForm({
  fileInputRef,
  preview,
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
  handleCancelar,
}) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <LargeCard
      color={"bg-yellow-light"}
      p={"p-0"}
      size={
        "h-[95%] md:h-[90%] w-[95%] md:w-[85%] lg:w-[70%] max-h-[850px] overflow-hidden flex flex-col min-h-0"
      }
      data-aos="fade-up"
    >
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 lg:px-12 lg:py-8 flex flex-col md:flex-row items-center md:items-start justify-start md:justify-between gap-6 md:gap-8 pb-10 xl:pt-25 [&::-webkit-scrollbar]:hidden overscroll-none min-h-0">
        <div className="relative shrink-0 mt-4 md:mt-0 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-[350px] lg:h-[350px] flex items-center justify-center">
          <div
            className="w-full h-full rounded-full border-2 border-orange flex items-center justify-center bg-white cursor-pointer overflow-hidden relative shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#E8592A] hover:shadow-lg hover:shadow-orange/30"
            onClick={() => fileInputRef.current.click()}
            title="Clique para escolher uma foto"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                className="h-[60%] object-contain"
                src={familyIcon}
                alt="Family"
              />
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className="absolute bottom-0 right-0 md:bottom-[6%] md:right-[6%] xl:right-4 xl:bottom-4 z-10">
            <DefaultButton
              onClick={(e) => {
                e.stopPropagation();
                preview ? removeImagem() : fileInputRef.current.click();
              }}
              another_padding={"p-0"}
              another_size={
                "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-20 lg:w-20"
              }
              another_text_size={
                "text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex items-center justify-center leading-none mt-[-3px]"
              }
              most_radius={true}
              text={preview ? "×" : "+"}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-5 w-full md:flex-1 ajuste-desfoque pb-4 md:pb-0 overflow-hidden shrink-0">
          <div className="flex flex-col gap-2 md:gap-3 w-full">
            <InputAddFamily
              id="nomeFamilia"
              placeholder="Nome da Família"
              w="w-full"
              value={formData.nomeFamilia}
              onChange={(e) => handleChange("nomeFamilia", e.target.value)}
              onBlur={() => validarCampo("nomeFamilia", formData.nomeFamilia)}
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

            <div className="flex flex-row gap-2 md:gap-3 w-full">
              <SelectAddFamily
                id="uf"
                w="w-[30%] sm:w-[25%] min-w-0"
                value={formData.uf}
                onChange={(e) => handleChange("uf", e.target.value)}
                onBlur={() => validarCampo("uf", formData.uf)}
                onKeyDown={(e) => handleKeyDown(e, "uf")}
                error={errosCampos.uf}
              />
              <InputAddFamily
                id="cep"
                placeholder="CEP"
                w="flex-1 min-w-0"
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

            <div className="flex flex-row gap-2 md:gap-3 w-full">
              <InputAddFamily
                id="cidade"
                placeholder="Cidade"
                w="flex-[3] min-w-0"
                value={formData.cidade}
                onChange={(e) => handleChange("cidade", e.target.value)}
                onBlur={() => validarCampo("cidade", formData.cidade)}
                onKeyDown={(e) => handleKeyDown(e, "cidade")}
                error={errosCampos.cidade}
              />
              <InputAddFamily
                id="bairro"
                placeholder="Bairro"
                w="flex-[2] min-w-0"
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

            <div className="flex flex-row gap-2 md:gap-3 w-full">
              <InputAddFamily
                id="numero"
                placeholder="Número"
                w="flex-[2] min-w-0"
                value={formData.numero}
                onChange={(e) => handleChange("numero", e.target.value)}
                onBlur={() => validarCampo("numero", formData.numero)}
                onKeyDown={(e) => handleKeyDown(e, "numero")}
                error={errosCampos.numero}
              />
              <InputAddFamily
                id="complemento"
                placeholder="Complemento"
                w="flex-[3] min-w-0"
                value={formData.complemento}
                onChange={(e) => handleChange("complemento", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "complemento")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 md:gap-3 mt-1 w-full">
            <InputEmailMembers
              membros={formData.membros}
              currentEmail={currentEmail}
              setCurrentEmail={setCurrentEmail}
              handleAddMember={handleAddMember}
              handleRemoveMember={handleRemoveMember}
              error={errosCampos.membros}
              setErrosCampos={setErrosCampos}
            />

            <div className="w-full flex justify-between gap-3 mt-4">
              <DefaultButton
                text="Cancelar"
                theme={false}
                another_size={"flex-1"}
                another_text_size={"text-lg md:text-xl lg:text-2xl"}
                onClick={handleCancelar}
              />
              <DefaultButton
                text="Confirmar"
                theme={true}
                another_size={"flex-1"}
                another_text_size={"text-lg md:text-xl lg:text-2xl"}
                onClick={handleConfirmar}
              />
            </div>
          </div>
        </div>
      </div>
    </LargeCard>
  );
}

export default AddFamilyForm;
