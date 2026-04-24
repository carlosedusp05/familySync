import ListContainer from "./ListContainer";

function MultLists({ lists = [] }) {
  return (
    <div
      className="flex flex-col gap-2 h-full overflow-y-auto px-2 [&::-webkit-scrollbar]:w-3
    [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-[#282828]
    [&::-webkit-scrollbar-thumb]:rounded-md"
    >
      {lists.map((list, index) => (
        <ListContainer
          key={index}
          name={list.name}
          total_spent={list.total_spent}
          percentage_now={list.percentage_now}
          author={list.author}
        />
      ))}
    </div>
  );
}

export default MultLists;
