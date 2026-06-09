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
  const [userProfile, setUserProfile] = useState(null);
  const [families, setFamilies] = useState([]);
  const [infos, setInfos] = useState([]);

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [isLoadingInfos, setIsLoadingInfos] = useState(false);

  const clearUserData = () => {
    setUserProfile(null);
    setFamilies([]);
    setInfos([]);
  };

  const refreshUser = useCallback(async () => {
    setIsLoadingUser(true);
    const token = Cookies.get("familysync_token");

    if (!token) {
      setIsLoadingUser(false);
      clearUserData();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id_usuario;

      const dataResponse = await userService.getFamiliesByUser(userId);

      const familiaDados = dataResponse?.family || [];
      const familiasMapeadas = familiaDados.map((f) => ({
        ...f,
        id: f.id_familia || f.id,
      }));
      setFamilies(familiasMapeadas);

      const profileData = dataResponse?.user || {};
      const nomeUsuario = profileData.nome || decoded.nome || "Usuário";
      const nomeLimpo = nomeUsuario.trim();

      const fotoFinal =
        profileData.foto && profileData.foto !== "null"
          ? profileData.foto.startsWith("http")
            ? profileData.foto
            : `http://localhost:3000/${profileData.foto}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              nomeLimpo,
            )}&background=FB923C&color=fff`;

      setUserProfile({
        ...profileData,
        nome: nomeLimpo,
        email: decoded.email || profileData.email,
        foto: fotoFinal,
      });

      setIsLoadingUser(false);
      setIsLoadingUser(false);

      const isMobile = window.innerWidth <= 768;

      if (!isMobile) {
        setIsLoadingInfos(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const infoResponse = await infoService.getInfosUser();
          const infosFormatadas = Array.isArray(infoResponse)
            ? infoResponse
            : infoResponse?.dados || infoResponse?.Response || [];

          const idsFamiliasDoUsuario = familiasMapeadas.map((f) => f.id);

          const infosFiltradas = infosFormatadas.filter(
            (info) =>
              idsFamiliasDoUsuario.includes(info.id_familia) &&
              info.id_usuario_informacao !== null,
          );

          setInfos(familiasMapeadas.length > 0 ? infosFiltradas : []);
        } catch (infoError) {
          console.error(
            "Erro ao carregar as informações familiares:",
            infoError,
          );
          setInfos([]);
        } finally {
          setIsLoadingInfos(false);
        }
      } else {
        setInfos([]);
        setIsLoadingInfos(false);
      }
    } catch (error) {
      console.error("Erro crítico ao carregar dados do usuário:", error);
      clearUserData();
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        families,
        infos,
        isLoadingUser,
        isLoadingInfos,
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
