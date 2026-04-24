import MainLayout from "../layouts/Mainlayout";
import LargeCard from "../components/ui/LargeCard";
import DefaultButton from "../components/ui/DefaultButton";
import { editIconWhite } from "../assets";
import MultItemsList from "../components/ui/MultItemsList";
import SearchBar from "../components/ui/SearchBar";
import ListContainer from "../components/ui/ListContainer";
import { useState } from "react";

function ListaScreen() {
  const initialItems = [
    { name: "Arroz 5kg", price: 29.9, units: 1 },
    { name: "Feijão Carioca", price: 8.5, units: 2 },
    { name: "Azeite de Oliva", price: 34.0, units: 1 },
    { name: "Leite Integral", price: 5.2, units: 12 },
    { name: "Café Torrado", price: 18.9, units: 2 },
    { name: "Açúcar Refinado", price: 4.5, units: 3 },
    { name: "Macarrão Spaguetti", price: 3.8, units: 4 },
    { name: "Molho de Tomate", price: 2.5, units: 6 },
    { name: "Óleo de Soja", price: 7.2, units: 2 },
    { name: "Pão de Forma", price: 9.9, units: 1 },
    { name: "Manteiga com Sal", price: 12.5, units: 1 },
    {
      name: "Detergente Líquido",
      price: 2.2,
      units: 5,
    },
    { name: "Papel Higiênico", price: 22.0, units: 1 },
    { name: "Sabonete Barra", price: 3.5, units: 4 },
    { name: "Creme Dental", price: 6.9, units: 2 },
    { name: "Saco de Lixo 50L", price: 14.0, units: 1 },
    { name: "Biscoito Recheado", price: 4.2, units: 3 },
    { name: "Suco de Uva 1L", price: 12.9, units: 2 },
    { name: "Iogurte Natural", price: 3.9, units: 4 },
    { name: "Esponja de Aço", price: 5.5, units: 1 },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === initialItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(initialItems.map((_, index) => index));
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center py-12 h-full">
        <LargeCard
          max_shadow={true}
          color="bg-yellow-light"
          not_pop_up={true}
          size={"h-full w-[80%]"}
          p={"py-[43px] px-[80px]"}
          display={"flex"}
        >
          <div className="h-full w-[37%] pt-10 pr-18 border-r-2 border-black">
            <div className="py-10 px-3">
              <h1 className="text-orange-dark text-[40px] font-bold">
                Nome da Lista
              </h1>
              <h1 className="text-brown-dark text-[16px]">
                Fulado, Ciclano, Carlos, Eduardo...
              </h1>
            </div>

            <div className="h-[65%] w-full bg-terracota rounded-2xl flex flex-wrap items-center justify-center pt-5">
              <div className="h-[10%] w-full flex items-center justify-between pl-4 pr-8">
                <DefaultButton
                  text={
                    selectedItems.length === initialItems.length
                      ? "Desmarcar todos"
                      : "Selecionar todos"
                  }
                  onClick={handleSelectAll}
                  another_text_size="text-[24px]"
                  another_size="h-[3%] w-[50%]"
                  another_text_weight="font-normal"
                  another_color={
                    selectedItems.length === initialItems.length
                      ? "bg-brown-dark"
                      : "bg-orange-dark"
                  }
                />
                <img
                  src={editIconWhite}
                  alt="Pincel de edição"
                  className="h-10 w-10 cursor-pointer"
                  draggable={false}
                />
              </div>

              <div className="h-[85%] w-full">
                <MultItemsList
                  items_list={initialItems}
                  selectedItems={selectedItems}
                  toggleItem={toggleItem}
                />
              </div>
            </div>
          </div>
          <div className="h-full w-[67%] flex justify-center flex-wrap">
            <div className="w-full flex justify-evenly items-center pl-8">
              <SearchBar />
              <DefaultButton
                text="+"
                another_size="h-13 w-13"
                another_text_size="text-[50px]"
                another_color="bg-orange-dark"
                another_padding="pb-2 px-6"
                most_radius={true}
              />
            </div>
            <div className="h-[80%] w-full bg-amber-400">
              <ListContainer />
            </div>
          </div>
        </LargeCard>
      </div>
    </MainLayout>
  );
}

export default ListaScreen;
