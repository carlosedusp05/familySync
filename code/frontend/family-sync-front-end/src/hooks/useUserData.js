import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { formatUserName } from "../utils/formatters";
import { infoService } from "../services/infoService";

export function useUserData() {
  const [userData, setUserData] = useState({
    id_usuario: 0,
    nome: "Usuário",
    email: "Carregando...",
    nomeFamilia: "Carregando...",
  });

  const [infos, setInfos] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const token = Cookies.get("familysync_token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const nomeBruto = decoded.nome || "Usuário";
          const nomeFormatado = formatUserName(nomeBruto);

          setUserData({
            id_usuario: decoded.id_usuario,
            nome: nomeFormatado,
            email: decoded.email || "E-mail não encontrado",
            nomeFamilia: decoded.nome_familia || "Minha Família",
          });

          const IdUsuario = parseInt(decoded.id_usuario);
          const response = await infoService.getInfosById(IdUsuario);

          setInfos(response);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      }
    };

    loadData();
  }, []);

  return { userData, infos };
}
