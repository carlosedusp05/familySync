import { searchIcon } from "../../assets";

function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center justify-center h-13 w-[88%] bg-white shadow-[12px] rounded-2xl px-5">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Procure aqui..."
        className="flex-1 text-xl text-black outline-none indent-5"
      />
      <img src={searchIcon} alt="Icone de Pesquisa" className="w-8 h-8" />
    </div>
  );
}

export default SearchBar;
