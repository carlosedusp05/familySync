import { searchIcon } from "../../assets";

function SearchBar() {
  return (
    <div className="flex items-center justify-center h-15 w-[85%] bg-white shadow-lg rounded-2xl px-6">
      <input
        type="text"
        placeholder="Procure aqui..."
        className="flex-1 text-4xl text-black outline-none indent-5"
      />
      <img src={searchIcon} alt="Icone de Pesquisa" className="w-10 h-10" />
    </div>
  );
}

export default SearchBar;
