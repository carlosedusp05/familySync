import { createContext, useContext, useState, useEffect } from "react";
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

  const token = Cookies.get("familysync_token");

  useEffect(() => {
    if (!token) {
      setIsLoadingUser(false);
      return;
    }

    async function loadGlobalUserData() {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id_usuario;

        const [userResponse, familiesResponse] = await Promise.all([
          userService.getUserById(userId),
          userService.getFamiliesByUser(userId),
        ]);

        const profileData = userResponse?.Response?.[0] || userResponse;
        setUserProfile({
          ...profileData,
          nome: decoded.nome || profileData.nome,
          email: decoded.email || profileData.email,
        });

        // 2. CORREÇÃO DA FAMÍLIA: Garantimos que seja SEMPRE um Array, mesmo que venha vazio
        const familiaDados = familiesResponse?.family || [];
        setFamilies(familiaDados);

        // 3. Buscar infos apenas se tiver família e garantir que seja um Array
        if (familiaDados.length > 0) {
          const infoResponse = await infoService.getInfosById(userId);
          // Caso sua API de infos também retorne dentro de Response, tratamos aqui:
          setInfos(
            Array.isArray(infoResponse)
              ? infoResponse
              : infoResponse?.Response || [],
          );
        }
      } catch (error) {
        console.error("Erro ao carregar dados globais do usuário:", error);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadGlobalUserData();
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        families,
        infos,
        isLoadingUser,
        setUserProfile,
        setFamilies,
        setInfos,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
