import DefaultButton from "../../ui/DefaultButton";

function PermissionsModal({ isOpen, onClose, member }) {
  if (!isOpen) return null;

  const permissionsList = [
    {
      id: "calendario",
      title: "Editar Calendário",
      description: "Adicionar, alterar ou remover eventos na agenda.",
      defaultChecked: true,
    },
    {
      id: "lista",
      title: "Gerenciar Listas",
      description: "Criar novas listas e gerenciar tarefas ou compras.",
      defaultChecked: false,
    },
    {
      id: "despesas",
      title: "Controlar Despesas",
      description: "Registrar gastos e visualizar painéis financeiros.",
      defaultChecked: true,
    },
    {
      id: "informacoes",
      title: "Alterar Informações",
      description: "Editar nome, endereço e foto de capa.",
      defaultChecked: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Gerenciar Permissões
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Configurando acessos para: <strong>{member?.name}</strong>
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          {permissionsList.map((permission) => (
            <label
              key={permission.id}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100/70 transition-colors"
            >
              <input
                type="checkbox"
                defaultChecked={permission.defaultChecked}
                className="w-4 h-4 accent-orange rounded-md cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">
                  {permission.title}
                </p>
                <p className="text-[11px] leading-snug text-gray-500 mt-0.5">
                  {permission.description}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors text-xs"
          >
            Cancelar
          </button>
          <DefaultButton
            text="Salvar Permissões"
            another_size="w-auto px-4 h-9"
            another_text_size="text-xs"
            another_padding="py-0"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default PermissionsModal;
