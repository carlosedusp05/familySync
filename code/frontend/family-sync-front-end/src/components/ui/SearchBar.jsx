import { searchIcon } from "../../assets";

function SearchBar() {
  return (
    <div className="flex items-center justify-center h-10 w-[85%] bg-white shadow-[12px] rounded-2xl px-2">
      <input
        type="text"
        placeholder="Procure aqui..."
        className="flex-1 text-2xl text-black outline-none indent-5"
      />
      <img src={searchIcon} alt="Icone de Pesquisa" className="w-10 h-10" />
    </div>
  );
}

export default SearchBar;
