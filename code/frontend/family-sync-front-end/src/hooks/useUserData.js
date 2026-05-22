import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { formatUserName } from "../utils/formatters";
import { infoService } from "../services/infoService";
import { userService } from "../services/userService";
import { eventService } from "../services/eventService";

export function useUserData() {
  const [userData, setUserData] = useState(null);
  const [isFamily, setIsFamily] = useState(null);
  const [infos, setInfos] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const token = Cookies.get("familysync_token");

      if (token) {
        try {
          const decoded = jwtDecode(token);

          const dadosFamily = await userService.getFamiliesByUser(
            decoded.id_usuario,
          );

          setIsFamily(dadosFamily.family);

          const nomeBruto = decoded.nome || "Usuário";
          const nomeFormatado = formatUserName(nomeBruto);

          setUserData({
            id_usuario: decoded.id_usuario,
            nome: nomeFormatado,
            email: decoded.email || "E-mail não encontrado",
            nomeFamilia: dadosFamily.family[0]?.nome || "",
          });

          if (dadosFamily.family.length > 0) {
            const IdUsuario = parseInt(decoded.id_usuario);
            const response = await infoService.getInfosById(IdUsuario);
            setInfos(response);
          } else {
            setInfos({});
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      }
    };

    loadData();
  }, []);

  return { userData, infos, isFamily };
}
