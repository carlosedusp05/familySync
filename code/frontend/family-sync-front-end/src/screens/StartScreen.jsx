import { imageBackground } from "../assets";
import DefaultHeader from "../components/layout/DefaultHeader";
import BackgroundImage from "../components/ui/BackgroundImage";
import MenuStart from "../components/ui/MenuStart";
import { useState, useEffect } from "react";

function StartScreen(props) {
  const [userData, setUserData] = useState({
    nome: "Usuário",
    email: "Carregando...",
    nomeFamilia: "Carregando...",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("@FamilySync:user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const nomeFormatado = parsedUser.nome
          ? parsedUser.nome
              .toLowerCase()
              .split(" ")
              .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
              .join(" ")
          : "Usuário";

        setUserData({
          nome: nomeFormatado,
          email: parsedUser.email || "E-mail não encontrado",
          nomeFamilia: "Nome familia",
        });
      } catch (error) {
        console.error("Erro ao converter dados", error);
      }
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <BackgroundImage
        src={imageBackground}
        alt={"Imagem Fundo"}
        blur_or_glass={"blur"}
      />
      <DefaultHeader />
      <div className="w-full flex justify-center items-center h-full ">
        <MenuStart props={props} userData={userData} />
      </div>
    </div>
  );
}

export default StartScreen;
