import DefaultCard from "../ui/DefaultCard";
import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import MultTextField from "../ui/MultTextField";
import { editIcon } from "../../assets";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function AccountEdit() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const prefetchLoggedIn = () => {
    import("../../screens/StartScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  const prefetchLogout = () => {
    import("../../screens/InicioScreen").catch(() => {
      console.log("Erro ao pré-carregar a tela");
    });
  };

  // ==========================================
  // FUNÇÃO DE LOGOUT
  // ==========================================
  const handleLogout = () => {
    // 1. Apaga a "chave" de acesso do navegador
    localStorage.removeItem("@FamilySync:isAuthenticated");
    localStorage.removeItem("@FamilySync:user");
    // 2. Manda o usuário para a tela pública (que vai redirecionar pro Start)
    navigate("/");
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      <div className="absolute top-10 left-10 ">
        <DefaultButton
          text="Sair da conta"
          logout_image={true}
          onMouseEnter={prefetchLogout}
          onClick={handleLogout} // <-- Agora chama a função que limpa o cache
        />
      </div>
      <DefaultCard>
        <div className="w-30 h-30 relative rounded-full border-2 border-orange flex items-center justify-center bg-white">
          <IconPerfil is_white_backgroud={true} another_size={"h-70%"} />
          <div className="absolute -bottom-3 -right-3 flex items-center justify-center rounded-[50%] cursor-pointer">
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
              another_padding={"px-0 pb-1"}
              another_size={"h-12 w-12"}
              another_text_size={"text-3xl"}
              most_radius={true}
              text="+"
            />
          </div>
        </div>
        <h1 className="text-orange text-3xl -mt-6">Eu</h1>
        <div className=" w-[90%] flex justify-center items-center flex-wrap gap-5">
          <MultTextField
            text_fields={[
              { placeholder: "Nome", type: "text", src: editIcon },
              { placeholder: "Email", type: "email", src: editIcon },
              { placeholder: "CPF", type: "text", src: editIcon },
              { placeholder: "Data Nascimento", type: "text", src: editIcon },
              {
                placeholder: "Senha",
                type: "text",
                src: editIcon,
                alt: "Input Senha",
              },
              {
                placeholder: "Confirme a senha",
                type: "text",
                src: editIcon,
                alt: "Input Confirme a senha",
              },
            ]}
          />
        </div>

        <div className="flex items-center justify-center  h-14 gap-[25%] w-[90%]">
          <DefaultButton
            text="Cancelar"
            theme={false}
            border={true}
            onMouseEnter={prefetchLoggedIn}
            onClick={() => navigate("/dashboard")}
          />
          <DefaultButton
            text="Confirmar"
            theme={true}
            onMouseEnter={prefetchLoggedIn}
            onClick={() => navigate("/dashboard")}
          />
        </div>
      </DefaultCard>
    </div>
  );
}

export default AccountEdit;
