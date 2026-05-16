import React from "react";

function InputEmailMembers({
  membros,
  currentEmail,
  setCurrentEmail,
  handleAddMember,
  handleRemoveMember,
  error,
  setErrosCampos,
}) {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full bg-black/5 border border-orange p-3 rounded-2xl flex items-center h-18 shadow-sm transition-all duration-500 ease-in-out focus-within:bg-white focus-within:ring-2 focus-within:ring-orange/20">
        <div
          className="flex-1 flex items-center gap-2 overflow-x-auto overflow-y-hidden pb-1 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#282828] [&::-webkit-scrollbar-thumb]:rounded-md"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
          {membros.map((email, index) => (
            <div
              key={index}
              className="bg-orange/10 border border-orange/20 text-orange px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm shrink-0"
            >
              <span className="text-xl font-semibold">{email}</span>
              <button
                type="button"
                onClick={() => handleRemoveMember(email)}
                className="text-orange hover:text-red-light transition-colors flex items-center justify-center p-0.5"
                title="Remover e-mail"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}

          <input
            id="inputMembros"
            type="email"
            placeholder={
              membros.length === 0
                ? "E-mail do membro (opcional)..."
                : "Adicionar outro..."
            }
            value={currentEmail}
            onChange={(e) => {
              setCurrentEmail(e.target.value);
              if (error) {
                setErrosCampos((prev) => ({
                  ...prev,
                  membros: "",
                }));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAddMember();
              }
            }}
            className="flex-1 bg-transparent min-w-50 border-none outline-none text-black placeholder:text-black/40 text-lg px-2 shrink-0"
          />
        </div>
      </div>
      {error && (
        <span className="text-red-light text-sm mt-1 ml-2 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}

export default InputEmailMembers;
