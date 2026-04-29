import FamiliarCard from "./FamiliarCard";

function MultFamiliars({ familiars = [] }) {
  return (
    <div
      className="flex flex-col items-center gap-4 h-[62%] w-[90%] mx-auto overflow-y-auto pr-3
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-[#282828]
      [&::-webkit-scrollbar-thumb]:rounded-md"
    >
      {familiars.map((familiar, index) => (
        <FamiliarCard
          key={familiar.id || index}
          name={familiar.name}
          degree_of_relatives={familiar.degree_of_relatives}
        />
      ))}
    </div>
  );
}

export default MultFamiliars;
