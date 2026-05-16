import BackgroundImage from "../components/ui/BackgroundImage";
import { imageBackground } from "../assets";
import AccountEdit from "../components/forms/AccountEdit";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { usePerfil } from "../hooks/usePerfil";

function PerfilScreen() {
  const {
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
    isLoading,
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
  } = usePerfil();

  return (
    <div className="h-screen w-screen flex justify-center items-center relative">
      {isLoading && <LoadingOverlay />}
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <AccountEdit
        navigate={navigate}
        formData={formData}
        setFormData={setFormData}
        familiasDisponiveis={familiasDisponiveis}
        familiasSelecionadas={familiasSelecionadas}
        setFamiliasSelecionadas={setFamiliasSelecionadas}
        isFamiliesOpen={isFamiliesOpen}
        setIsFamiliesOpen={setIsFamiliesOpen}
        editableFields={editableFields}
        errosCampos={errosCampos}
        preview={preview}
        setPreview={setPreview}
        mostrarSenha={mostrarSenha}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        hoje={hoje}
        validateFieldOnBlur={validateFieldOnBlur}
        toggleEdit={toggleEdit}
        handleUpdate={handleUpdate}
        removeImagem={removeImagem}
        handleDeleteAccount={handleDeleteAccount}
        handleLogout={handleLogout}
      />
    </div>
  );
}

export default PerfilScreen;
