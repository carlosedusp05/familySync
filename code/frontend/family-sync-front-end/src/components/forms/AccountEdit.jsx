import IconPerfil from "../icons/IconPerfil";
import DefaultButton from "../ui/DefaultButton";
import MultTextField from "../ui/MultTextField";
import {
  editPencilBrownIcon,
  editBoxIcon,
  deleteRedIcon,
  chevronDownBrownIcon,
} from "../../assets";
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

  const handleLogout = () => {
    localStorage.removeItem("@FamilySync:isAuthenticated");
    localStorage.removeItem("@FamilySync:user");
    navigate("/");
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      <div className="absolute top-10 left-10">
        <DefaultButton
          text="Sair da conta"
          logout_image={true}
          onMouseEnter={prefetchLogout}
          onClick={handleLogout}
        />
      </div>

      <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-[30px] p-6 pb-8 flex flex-col items-center w-142.5 max-w-[90vw] shadow-2xl relative">
        <div className="w-30 h-30 relative rounded-full border-2 border-[#ff7b30] flex items-center justify-center bg-white mt-2">
          <IconPerfil is_white_backgroud={true} another_size={"h-[65%]"} />
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

        <h1 className="text-[#ff7b30] text-3xl font-medium mt-3 mb-4">Eu</h1>

        <div className="w-[95%] flex flex-col gap-3">
          <MultTextField
            variant="profile"
            text_fields={[
              {
                placeholder: "Nome do usuário",
                type: "text",
                src: editPencilBrownIcon,
              },
              {
                placeholder: "E-mail",
                type: "email",
                src: editPencilBrownIcon,
              },
              { placeholder: "CPF", type: "text", src: editPencilBrownIcon },
              {
                placeholder: "Senha",
                type: "password",
                src: editPencilBrownIcon,
              },
              {
                placeholder: "Data Nascimento",
                type: "text",
                src: editPencilBrownIcon,
              },
              {
                placeholder: "Família",
                type: "text",
                src: chevronDownBrownIcon || editPencilBrownIcon,
              },
            ]}
          />
        </div>

        <div className="w-[95%] bg-white rounded-xl mt-4 p-4 shadow-sm flex flex-col">
          <h2 className="text-[#4a2511] font-bold text-2xl mb-2">
            Configurações avançadas
          </h2>
          <hr className="border-t border-[#4a2511] mb-3 opacity-30" />
          <div className="flex items-center justify-between cursor-pointer group pt-1">
            <div className="flex items-center gap-3">
              <img
                src={deleteRedIcon}
                alt="Excluir conta"
                className="w-10 h-10 object-contain"
              />
              <span className="text-[#f03e3e] font-bold text-xl">
                Excluir conta
              </span>
            </div>

            <img
              src={editBoxIcon}
              alt="Editar configuração"
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        {/* Botões Inferiores */}
        <div className="flex items-center justify-between w-[95%] mt-6 h-12 gap-4">
          <div className="flex-1 h-full flex">
            <DefaultButton
              text="Cancelar"
              theme={false}
              border={false}
              onMouseEnter={prefetchLoggedIn}
              onClick={() => navigate("/dashboard")}
            />
          </div>
          <div className="flex-1 h-full flex">
            <DefaultButton
              text="Confirmar"
              theme={true}
              onMouseEnter={prefetchLoggedIn}
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountEdit;
