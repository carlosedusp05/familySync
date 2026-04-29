import ItemAllergy from "./ItemAllergy";

function MultAllergys({ allergys = [] }) {
  return (
    <div
      className="flex flex-col items-center gap-4 h-[90%] w-[90%] mx-auto overflow-y-auto pr-3
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-[#282828]
      [&::-webkit-scrollbar-thumb]:rounded-md"
    >
      {allergys.map((allergy, index) => (
        <ItemAllergy
          key={allergy.id || index}
          title={allergy.title}
          desc={allergy.desc}
        />
      ))}
    </div>
  );
}

export default MultAllergys;
