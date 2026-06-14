import { useState } from "react";
import LargeCard from "../../ui/LargeCard";
import DefaultButton from "../../ui/DefaultButton";
import SearchBar from "../../ui/SearchBar";
import MultLists from "./MultLists";
import MultItemsList from "./MultItemsList";
import { editIcon } from "../../../assets";
import LoadingOverlay from "../../ui/LoadingOverlay";

function ListContent({
  lists,
  activeList,
  setActiveListId,
  searchQuery,
  setSearchQuery,
  toggleItem,
  handleSelectAllItems,
  toggleFavorite,
  handleOpenModal,
  handleDeleteList,
  handleAddItem,
  handleDeleteItem,
  isLoading,
}) {
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const allItemsSelected =
    activeList?.items?.length > 0 &&
    activeList.items.every((item) => item.isSelected);

  const handleSelectList = (id) => {
    setActiveListId(id);
    setShowMobileDetails(true);
  };

  return (
    <div className="flex items-center justify-center pt-4 pb-6 md:py-8 xl:py-12 h-full w-full px-4 md:px-8 xl:px-0">
      {isLoading && <LoadingOverlay />}
      <LargeCard
        color="bg-black/20 backdrop-blur-md"
        not_pop_up={true}
        size={"h-full w-full xl:w-[80%]"}
        p={"py-6 px-4 md:py-8 md:px-8 xl:py-[43px] xl:px-[80px]"}
        display={"flex overflow-hidden relative"}
      >
        <div
          className={`${
            showMobileDetails ? "flex" : "hidden"
          } xl:flex h-full w-full xl:w-[37%] xl:pt-10 xl:pr-18 xl:border-r border-[#D6CFC2] flex-col min-w-0 relative`}
        >
          <button
            type="button"
            onClick={() => setShowMobileDetails(false)}
            className="xl:hidden absolute top-0 right-2 text-orange-dark font-black text-2xl p-2 hover:scale-110 active:scale-95 transition-transform"
          >
            ✕
          </button>

          <div className="py-2 md:py-6 xl:py-10 xl:px-3 shrink-0 h-auto xl:h-37.5 flex flex-col justify-center w-[90%] xl:w-full min-w-0 overflow-hidden">
            <h1
              className={`text-orange-dark truncate block w-full h-auto xl:h-10 ${
                activeList?.nome
                  ? activeList.nome.length <= 20
                    ? "text-3xl md:text-4xl"
                    : activeList.nome.length <= 40
                      ? "text-2xl md:text-3xl"
                      : "text-xl md:text-2xl"
                  : "text-3xl md:text-4xl"
              } font-semibold`}
              title={activeList?.nome}
            >
              {activeList ? activeList.nome : "Selecione uma Lista"}
            </h1>

            <h1
              className="text-white text-[14px] md:text-[16px] mt-1 truncate block w-full"
              title={
                activeList?.author ? `Criado por: ${activeList.author}` : ""
              }
            >
              {activeList ? `Criado por: ${activeList.author}` : "---"}
            </h1>
          </div>

          {activeList && (
            <div className="flex-1 min-h-0 w-full shadow-sm rounded-2xl flex flex-col gap-4 pb-4 mt-2 xl:mt-0">
              <div className="h-auto xl:h-[10%] w-full flex items-center justify-between pl-1 md:pl-4 pr-1 md:pr-8 shrink-0">
                <DefaultButton
                  text={
                    allItemsSelected ? "Desmarcar todos" : "Selecionar todos"
                  }
                  onClick={handleSelectAllItems}
                  another_text_size="text-[14px] md:text-[18px] xl:text-[20px]"
                  another_size="h-10 w-[65%] md:w-[50%]"
                  another_text_weight="font-normal"
                  another_color={
                    allItemsSelected ? "bg-brown-dark" : "bg-orange-dark"
                  }
                />
                <img
                  src={editIcon}
                  alt="Pincel de edição"
                  className="h-8 w-8 md:h-10 md:w-10 cursor-pointer hover:scale-110 transition-transform shrink-0 ml-2"
                  draggable={false}
                  onClick={() => handleOpenModal(activeList, true)}
                />
              </div>

              <div className="flex-1 min-h-0 w-full mt-2 xl:mt-2">
                <MultItemsList
                  items_list={activeList.items || []}
                  toggleItem={toggleItem}
                  onAddItem={handleAddItem}
                  onDeleteItem={handleDeleteItem}
                />
              </div>
            </div>
          )}
        </div>

        <div
          className={`${
            !showMobileDetails ? "flex" : "hidden"
          } xl:flex h-full w-full xl:w-[63%] flex-col gap-4 md:gap-6 xl:px-8 min-w-0 relative`}
        >
          <div className="w-full flex justify-center xl:justify-between items-center gap-2 xl:pl-8">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="hidden xl:block">
              <DefaultButton
                text="+"
                another_size="h-13 w-13 shrink-0"
                another_text_size="text-[50px]"
                another_color="bg-orange-dark"
                another_padding="pb-2 px-6"
                another_text_weight="font-medium"
                most_radius={true}
                onClick={() => handleOpenModal(null, false)}
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 w-full flex flex-col relative">
            <div className="flex-1 w-full h-full min-h-0">
              {lists && lists.length > 0 ? (
                <MultLists
                  lists={lists}
                  onSelectList={handleSelectList}
                  onToggleFavorite={toggleFavorite}
                  onDeleteList={handleDeleteList}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/60 text-center px-4 md:px-10">
                  <p className="text-xl md:text-3xl mb-2 text-white/80">
                    Nenhuma lista encontrada
                  </p>
                  <p className="text-sm md:text-lg">
                    Você ainda não possui listas. Clique no botão de criar para
                    começar!
                  </p>
                </div>
              )}
            </div>
            <div className="xl:hidden absolute bottom-[2%] md:bottom-[5%] left-0 right-0 flex justify-center items-center pointer-events-none z-20">
              <button
                type="button"
                onClick={() => handleOpenModal(null, false)}
                className="pointer-events-auto bg-orange hover:bg-orange/70 active:scale-95 transition-all duration-300 text-white flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 rounded-full font-bold text-[20px] md:text-[24px] shadow-lg"
              >
                Criar lista
                <span className="text-4xl md:text-5xl font-bold leading-none mb-1 md:mb-2">
                  +
                </span>
              </button>
            </div>
          </div>
        </div>
      </LargeCard>
    </div>
  );
}

export default ListContent;
