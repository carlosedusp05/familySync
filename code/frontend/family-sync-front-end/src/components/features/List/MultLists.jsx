import ListContainer from "./ListContainer";

function MultLists({
  lists = [],
  onSelectList,
  onToggleFavorite,
  onDeleteList,
}) {
  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto px-2 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md">
      {lists.map((list, index) => (
        <ListContainer
          key={list.id}
          list={list}
          background={index % 2 === 0 ? "bg-yellow-cream" : "bg-yellow-light"}
          onClick={() => onSelectList(list.id)}
          onToggleFavorite={() => onToggleFavorite(list.id)}
          onDelete={() => onDeleteList(list.id)}
        />
      ))}
    </div>
  );
}

export default MultLists;
