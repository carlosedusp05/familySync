import MainLayout from "../layouts/Mainlayout";
import MultNoticationField from "../components/ui/MultNotificationField";

function NotificationsScreen() {
  return (
    <MainLayout>
      <div className="w-full h-full pt-16">
        <div
          className="w-[70%] h-full overflow-y-auto flex justify-center items-center flex-wrap gap-2 mx-auto  px-2
            [&::-webkit-scrollbar]:w-2.5
            [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[#282828]
            [&::-webkit-scrollbar-thumb]:rounded-md"
        >
          <MultNoticationField
            notifications={[
              {
                title: "Aviso da Mãe: O frango! 🐔",
                text: "Não se esqueçam de tirar o frango do congelador. Se eu chegar em casa e estiver de pedra, o bicho vai pegar.",
                time: "20/05/2026 10:00",
              },
              {
                title: "Churrasco de Domingo 🍖",
                text: "Confirmado na casa do Tio João! Tragam suas bebidas. A carne já está garantida, não se atrasem.",
                time: "20/05/2026 13:45",
              },
              {
                title: "Emergência: Senha da Netflix 📺",
                text: "Alguém mudou a senha de novo? Deslogou da TV da sala e eu só queria terminar minha série.",
                time: "19/05/2026 21:30",
              },
              {
                title: "Aniversário da Vó 👵🎉",
                text: "Lembrando que é o aniversário da avó neste fim de semana. Vamos organizar a vaquinha do presente.",
                time: "18/05/2026 09:00",
              },
              {
                title: "O cachorro precisa passear 🐕",
                text: "Alguém leva o Toby pra dar uma volta, por favor? Ele está latindo para a parede há meia hora.",
                time: "20/05/2026 14:15",
              },
              {
                title: "Aviso de Faxina 🧹",
                text: "Sábado de manhã todo mundo de pé para ajudar na limpeza da casa. Sem desculpinha de que vai dormir até tarde!",
                time: "19/05/2026 18:00",
              },
              {
                title: "Quem comeu meu pudim? 🍮",
                text: "Eu deixei metade de um pudim na geladeira ontem à noite e ele sumiu. Exijo respostas.",
                time: "20/05/2026 08:30",
              },
              {
                title: "Fatura da Internet 🌐",
                text: "O boleto da internet vence amanhã. Façam o Pix para a minha conta que eu já faço o pagamento hoje.",
                time: "17/05/2026 11:20",
              },
            ]}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default NotificationsScreen;
