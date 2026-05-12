import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";
import { familyIcon } from "../assets/index";
import DefaultButton from "../components/ui/DefaultButton";
import InputAddFamily from "../components/ui/InputAddFamily";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importando validadores (Certifique-se de ter esses validadores ou similares no seu arquivo)
import { validateName } from "../utils/validators.js";

function AddFamilyScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- Estados dos Campos ---
  const [nomeFamilia, setNomeFamilia] = useState("");
  const [telefone, setTelefone] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  // --- Estados de Erro ---
  const [errosCampos, setErrosCampos] = useState({});

  // --- Funções de Manipulação ---
  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const validateFieldOnBlur = (campoId, valor) => {
    let erroMensagem = "";

    switch (campoId) {
      case "nomeFamilia":
        erroMensagem = validateName(valor); // Reutilizando validador de nome
        break;
      case "telefone":
        if (!valor) erroMensagem = "O telefone é obrigatório";
        break;
      case "cep":
        if (!valor || valor.length < 8) erroMensagem = "CEP inválido";
        break;
      case "uf":
        if (!valor || valor.length !== 2) erroMensagem = "UF inválida";
        break;
      case "cidade":
      case "bairro":
      case "logradouro":
      case "numero":
        if (!valor) erroMensagem = "Campo obrigatório";
        break;
      default:
        break;
    }

    setErrosCampos((prev) => {
      const novos = { ...prev };
      erroMensagem ? (novos[campoId] = erroMensagem) : delete novos[campoId];
      return novos;
    });
  };

  const handleConfirmar = () => {
    // Validação geral antes de submeter
    const camposParaValidar = {
      nomeFamilia,
      telefone,
      uf,
      cep,
      cidade,
      bairro,
      logradouro,
      numero,
    };

    let novosErros = {};

    Object.keys(camposParaValidar).forEach((key) => {
      if (!camposParaValidar[key]) {
        novosErros[key] = "Este campo é obrigatório";
      }
    });

    if (Object.keys(novosErros).length > 0) {
      setErrosCampos(novosErros);
      return;
    }

    // Se chegar aqui, está tudo válido
    console.log("Dados da Família enviados:", {
      nomeFamilia,
      telefone,
      uf,
      cep,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
    });
    // lógica de serviço aqui...
  };

  const handleCancelar = () => {
    navigate(-1); // Volta para a tela anterior
  };

  return (
    <MainLayout>
      <div className="w-full h-full flex justify-center items-center">
        <LargeCard
          color={"bg-yellow-light"}
          p={"px-50"}
          size={"h-[80%] w-[75%]"}
        >
          <div className="h-full w-full flex items-center justify-between">
            {/* Foto da Família */}
            <div className="w-110 h-110 relative rounded-full border-2 border-orange flex items-center justify-center bg-white">
              <img className="h-[60%]" src={familyIcon} alt="Family Icon" />
              <div className="absolute bottom-3 right-1 flex items-center justify-center rounded-[50%] cursor-pointer">
                <input
                  className="absolute opacity-0 w-full h-full cursor-pointer hidden"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) console.log("Arquivo selecionado:", file);
                  }}
                />
                <DefaultButton
                  onClick={handleButtonClick}
                  another_padding={"px-0 pb-2"}
                  another_size={"h-25 w-25"}
                  another_text_size={"text-7xl"}
                  most_radius={true}
                  text="+"
                />
              </div>
            </div>

            {/* Formulário de Cadastro */}
            <div className="flex flex-col gap-8 w-[50%] justify-center">
              <div className="flex flex-col gap-3">
                <InputAddFamily
                  type="text"
                  placeholder="Nome da Família"
                  w="w-full"
                  value={nomeFamilia}
                  onChange={(e) => setNomeFamilia(e.target.value)}
                  onBlur={() => validateFieldOnBlur("nomeFamilia", nomeFamilia)}
                  error={errosCampos.nomeFamilia}
                />
                <InputAddFamily
                  type="text"
                  placeholder="Telefone Residencial"
                  w="w-full"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  onBlur={() => validateFieldOnBlur("telefone", telefone)}
                  error={errosCampos.telefone}
                />
                <div className="flex gap-3 w-full">
                  <InputAddFamily
                    type="text"
                    placeholder="UF"
                    w="w-[30%]"
                    value={uf}
                    maxLength={2}
                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                    onBlur={() => validateFieldOnBlur("uf", uf)}
                    error={errosCampos.uf}
                  />
                  <InputAddFamily
                    type="text"
                    placeholder="CEP"
                    w="w-[70%]"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    onBlur={() => validateFieldOnBlur("cep", cep)}
                    error={errosCampos.cep}
                  />
                </div>
                <div className="flex gap-3 w-full">
                  <InputAddFamily
                    type="text"
                    placeholder="Cidade"
                    w="w-[60%]"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    onBlur={() => validateFieldOnBlur("cidade", cidade)}
                    error={errosCampos.cidade}
                  />
                  <InputAddFamily
                    type="text"
                    placeholder="Bairro"
                    w="w-[40%]"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    onBlur={() => validateFieldOnBlur("bairro", bairro)}
                    error={errosCampos.bairro}
                  />
                </div>
                <InputAddFamily
                  type="text"
                  placeholder="Logradouro"
                  w="w-full"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  onBlur={() => validateFieldOnBlur("logradouro", logradouro)}
                  error={errosCampos.logradouro}
                />
                <div className="flex gap-3 w-full">
                  <InputAddFamily
                    type="text"
                    placeholder="Número"
                    w="w-[40%]"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    onBlur={() => validateFieldOnBlur("numero", numero)}
                    error={errosCampos.numero}
                  />
                  <InputAddFamily
                    type="text"
                    placeholder="Complemento (Opcional)"
                    w="w-[60%]"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </div>
              </div>

              {/* Seção de Ações */}
              <div className="flex flex-col gap-3">
                <div className="w-full bg-brown-dark rounded-2xl flex px-5 py-3 h-20 gap-3">
                  <p className="py-2 px-5 bg-orange text-brown-dark rounded-2xl w-[60%] flex items-center justify-center text-2xl">
                    Nome do usuário
                  </p>
                  <DefaultButton
                    text="Convidar"
                    another_text_size={"text-2xl"}
                    another_size={"w-[40%]"}
                  />
                </div>
                <div className="w-full flex justify-between">
                  <DefaultButton
                    text="Cancelar"
                    another_text_size={"text-2xl"}
                    another_size={"w-[40%]"}
                    theme={false}
                    onClick={handleCancelar}
                  />
                  <DefaultButton
                    text="Confirmar"
                    another_text_size={"text-2xl"}
                    another_size={"w-[40%]"}
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

export default AddFamilyScreen;
