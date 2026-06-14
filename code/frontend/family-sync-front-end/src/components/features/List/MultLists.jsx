import { useState, useRef, useEffect } from "react";
import ListContainer from "./ListContainer";

function MultLists({
  lists = [],
  onSelectList,
  onToggleFavorite,
  onDeleteList,
}) {
  const scrollRef = useRef(null);
  const [showShadow, setShowShadow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 5;
      setShowShadow(!isAtBottom);
    }
  };
  useEffect(() => {
    handleScroll();
  }, [lists]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-col gap-2 h-full overflow-y-auto pb-28 md:px-2 transform-gpu will-change-scroll [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md"
      >
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

      <div
        className={`absolute bottom-0 left-0 right-0 h-28 md:h-36 pointer-events-none z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent transform-gpu transition-opacity duration-300 ease-in-out ${
          showShadow ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </div>
  );
}

export default MultLists;
