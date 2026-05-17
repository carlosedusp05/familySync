import LargeCard from "../../ui/LargeCard";
import DefaultButton from "../../ui/DefaultButton";
import SearchBar from "../../ui/SearchBar";
import MultLists from "./MultLists";
import MultItemsList from "./MultItemsList";
import { editIcon } from "../../../assets";

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
}) {
  const allItemsSelected =
    activeList?.items?.length > 0 &&
    activeList.items.every((item) => item.isSelected);

  return (
    <div className="flex items-center justify-center py-12 h-full">
      <LargeCard
        color="bg-black/20 backdrop-blur-md"
        not_pop_up={true}
        size={"h-full w-[80%]"}
        p={"py-[43px] px-[80px]"}
        display={"flex"}
      >
        <div className="h-full w-[37%] pt-10 pr-18 border-r border-[#D6CFC2] flex flex-col min-w-0">
          <div className="py-10 px-3 shrink-0 h-37.5 flex flex-col justify-center w-full min-w-0 overflow-hidden">
            <h1
              className={`text-orange-dark truncate block w-full h-10 ${
                activeList?.name
                  ? activeList.name.length <= 20
                    ? "text-4xl"
                    : activeList.name.length <= 40
                      ? "text-3xl"
                      : "text-2xl"
                  : "text-4xl"
              } font-semibold`}
              title={activeList?.name}
            >
              {activeList ? activeList.name : "Selecione uma Lista"}
            </h1>

            <h1
              className="text-white text-[16px] mt-1 truncate block w-full"
              title={
                activeList?.author ? `Criado por: ${activeList.author}` : ""
              }
            >
              {activeList ? `Criado por: ${activeList.author}` : "---"}
            </h1>
          </div>

          {activeList && (
            <div className="flex-1 min-h-0 w-full shadow-sm rounded-2xl flex flex-col gap-4 pb-4">
              <div className="h-[10%] w-full flex items-center justify-between pl-4 pr-8 text shrink-0">
                <DefaultButton
                  text={
                    allItemsSelected ? "Desmarcar todos" : "Selecionar todos"
                  }
                  onClick={handleSelectAllItems}
                  another_text_size="text-[20px]"
                  another_size="h-10 w-[50%]"
                  another_text_weight="font-normal"
                  another_color={
                    allItemsSelected ? "bg-brown-dark" : "bg-orange-dark"
                  }
                />
                <img
                  src={editIcon}
                  alt="Pincel de edição"
                  className="h-10 w-10 cursor-pointer hover:scale-110 transition-transform shrink-0"
                  draggable={false}
                  onClick={() => handleOpenModal(activeList, true)}
                />
              </div>

              <div className="flex-1 min-h-0 w-full mt-2">
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

        <div className="h-full w-[63%] flex flex-col gap-6 px-8 min-w-0">
          <div className="w-full flex justify-evenly items-center pl-8">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <DefaultButton
              text="+"
              another_size="h-13 w-13"
              another_text_size="text-[50px]"
              another_color="bg-orange-dark"
              another_padding="pb-2 px-6"
              another_text_weight="font-medium"
              most_radius={true}
              onClick={() => handleOpenModal(null, false)}
            />
          </div>
          <div className="h-[93%] w-full flex flex-col">
            {lists && lists.length > 0 ? (
              <MultLists
                lists={lists}
                onSelectList={setActiveListId}
                onToggleFavorite={toggleFavorite}
                onDeleteList={handleDeleteList}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/60 text-center px-10">
                <p className="text-3xl mb-2 text-white/80">
                  Nenhuma lista encontrada
                </p>
                <p className="text-lg">
                  Você ainda não possui listas. Clique no botão{" "}
                  <strong>"+"</strong> acima para começar a criar!
                </p>
              </div>
            )}
          </div>
        </div>
      </LargeCard>
    </div>
  );
}

export default ListContent;
