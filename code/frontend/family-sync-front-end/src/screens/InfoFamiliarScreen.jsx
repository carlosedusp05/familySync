import MainLayout from "../layouts/Mainlayout";
import DefaultButton from "../components/ui/DefaultButton";
import MultAllergys from "../components/ui/MultAllergy";

function InfoFamiliarScreen() {
  return (
    <MainLayout>
      <div className="flex flex-row gap-4 items-center justify-center py-12 h-full">
        <div className="h-full w-[60%] bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-3xl p-8">
          <div className="w-full p-5 flex justify-end ">
            <DefaultButton
              text="Adicionar informação familiar"
              another_size={"h-15 w-100"}
              another_text_size={"text-2xl"}
              another_text_weight={"font-normal"}
              another_padding={""}
              another_color={"bg-orange-dark"}
            />
          </div>
          <MultAllergys
            allergys={[
              {
                id: 1,
                title: "Alergia a Glúten",
                desc: "Intolerância severa a proteínas encontradas no trigo, centeio e cevada. Requer dieta restrita e atenção a contaminações cruzadas.",
              },
              {
                id: 2,
                title: "Lactose",
                desc: "Dificuldade em digerir o açúcar do leite. Evitar derivados lácteos ou utilizar enzimas lactase antes do consumo.",
              },
              {
                id: 3,
                title: "Picada de Abelha",
                desc: "Reação anafilática potencial. Em caso de picada, administrar anti-histamínico imediatamente e procurar emergência médica.",
              },
              {
                id: 4,
                title: "Amendoim",
                desc: "Uma das alergias alimentares mais graves. Evitar qualquer alimento que contenha traços de oleaginosas.",
              },
              {
                id: 5,
                title: "Penicilina",
                desc: "Alergia a antibióticos da classe da penicilina. Notificar qualquer profissional de saúde antes de procedimentos médicos.",
              },
              {
                id: 6,
                title: "Ácaros e Poeira",
                desc: "Rinite alérgica sazonal. Manter ambientes ventilados, usar capas antiácaro e evitar tapetes ou cortinas pesadas.",
              },
              {
                id: 7,
                title: "Frutos do Mar",
                desc: "Reação a crustáceos e moluscos. Sintomas podem incluir urticária, inchaço e dificuldades respiratórias.",
              },
              {
                id: 8,
                title: "Proteína do Ovo",
                desc: "Comum em crianças. Atenção a produtos processados e algumas vacinas que utilizam proteína do ovo na composição.",
              },
              {
                id: 9,
                title: "Látex",
                desc: "Reação ao contato com borracha natural. Evitar luvas de látex, balões de festa e certos tipos de adesivos médicos.",
              },
              {
                id: 10,
                title: "Corantes Artificiais",
                desc: "Sensibilidade a corantes como Tartrazina (Amarelo 5). Pode causar hiperatividade ou reações cutâneas em pessoas sensíveis.",
              },
            ]}
          />
        </div>
        <div className="w-70 h-full bg-[#EED9CE]/40 backdrop-blur-lg border border-white/10 p-6 flex flex-col items-center gap-6 shadow-[-10px_0_30px_0_rgba(0,0,0,0.1)] rounded-[40px]">
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col items-center gap-1 w-full group cursor-pointer">
              <div className="bg-[#5D2A11] rounded-full h-24 w-24 flex items-center justify-center shadow-md transition-all group-hover:scale-105 border-4 border-transparent group-hover:border-[#5D2A11]/30"></div>
              <span className="text-[#5D2A11] text-xs font-bold uppercase tracking-widest">
                MEMBRO 1
              </span>
            </div>

            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 w-full group cursor-pointer"
              >
                <div className="bg-[#FEF6E4] rounded-full h-24 w-24 flex items-center justify-center shadow-sm transition-all group-hover:scale-105"></div>
                <span className="text-[#FEF6E4]/80 text-xs font-medium uppercase tracking-widest group-hover:text-[#FEF6E4]">
                  MEMBRO {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default InfoFamiliarScreen;
