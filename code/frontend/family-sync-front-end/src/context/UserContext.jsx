import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { userService } from "../services/userService";
import { infoService } from "../services/infoService";

const UserContext = createContext();

export function UserProvider({ children }) {
  // Centralizar o estado evita que múltiplos "setters" assíncronos quebrem o fluxo de render
  const [state, setState] = useState({
    userProfile: null,
    families: [],
    infos: [],
    isLoadingUser: true,
    isLoadingInfos: false,
  });

  const clearUserData = () => {
    setState({
      userProfile: null,
      families: [],
      infos: [],
      isLoadingUser: false,
      isLoadingInfos: false,
    });
  };

  const refreshUser = useCallback(async () => {
    const token = Cookies.get("familysync_token");

    if (!token) {
      clearUserData();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id_usuario;

      // Executa a primeira chamada de API
      const dataResponse = await userService.getFamiliesByUser(userId);

      const familiaDados = dataResponse?.family || [];
      const familiasMapeadas = familiaDados.map((f) => ({
        ...f,
        id: f.id_familia || f.id,
      }));

      const profileData = dataResponse?.user || {};
      const nomeUsuario = profileData.nome || decoded.nome || "Usuário";
      const nomeLimpo = nomeUsuario.trim();

      const fotoFinal =
        profileData.foto && profileData.foto !== "null"
          ? profileData.foto.startsWith("http")
            ? profileData.foto
            : `http://localhost:3000/${profileData.foto}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeLimpo)}&background=FB923C&color=fff`;

      const userProfileObj = {
        ...profileData,
        nome: nomeLimpo,
        email: decoded.email || profileData.email,
        foto: fotoFinal,
      };

      const isMobile = window.innerWidth <= 768;
      let infosFiltradas = [];

      // Em vez de quebrar o fluxo com múltiplos sets, processamos tudo em memória primeiro
      if (!isMobile) {
        try {
          // Mantém o timeout se necessário, mas não altera o estado global ainda!
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const infoResponse = await infoService.getInfosUser();
          const infosFormatadas = Array.isArray(infoResponse)
            ? infoResponse
            : infoResponse?.dados || infoResponse?.Response || [];

          const idsFamiliasDoUsuario = familiasMapeadas.map((f) => f.id);

          infosFiltradas = infosFormatadas.filter(
            (info) =>
              idsFamiliasDoUsuario.includes(info.id_familia) &&
              info.id_usuario_informacao !== null,
          );
        } catch (infoError) {
          console.error(
            "Erro ao carregar as informações familiares:",
            infoError,
          );
        }
      }

      // UM ÚNICO DISPARO: Altera o estado do app de uma vez só quando tudo estiver pronto
      setState({
        userProfile: userProfileObj,
        families: familiasMapeadas,
        infos: familiasMapeadas.length > 0 ? infosFiltradas : [],
        isLoadingUser: false,
        isLoadingInfos: false,
      });
    } catch (error) {
      console.error("Erro crítico ao carregar dados do usuário:", error);
      clearUserData();
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Helpers de compatibilidade para manter o restante do seu código funcionando sem alterações
  const setUserProfile = (val) =>
    setState((prev) => ({ ...prev, userProfile: val }));
  const setFamilies = (val) => setState((prev) => ({ ...prev, families: val }));
  const setInfos = (val) => setState((prev) => ({ ...prev, infos: val }));

  return (
    <UserContext.Provider
      value={{
        ...state,
        setUserProfile,
        setFamilies,
        setInfos,
        clearUserData,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
