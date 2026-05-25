import DefaultButton from "../../ui/DefaultButton";

function PermissionsModal({ isOpen, onClose, member }) {
  if (!isOpen) return null;

  const permissionsList = [
    {
      id: "calendario",
      title: "Editar Calendário",
      description:
        "Permite adicionar, alterar ou remover eventos e compromissos na agenda compartilhada.",
      defaultChecked: true,
    },
    {
      id: "lista",
      title: "Gerenciar Listas",
      description:
        "Permite criar novas listas e gerenciar tarefas, compras ou lembretes da casa.",
      defaultChecked: false,
    },
    {
      id: "despesas",
      title: "Controlar Despesas",
      description:
        "Permite registrar gastos, acompanhar o orçamento e visualizar os painéis financeiros.",
      defaultChecked: true,
    },
    {
      id: "informacoes",
      title: "Alterar Informações",
      description:
        "Permite editar o nome da família, atualizar o endereço e trocar a foto de capa.",
      defaultChecked: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl p-8 max-w-md w-full shadow-xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gerenciar Permissões
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Configurando acessos para: <strong>{member?.name}</strong>
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {permissionsList.map((permission) => (
            <label
              key={permission.id}
              className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100/70 transition-colors"
            >
              <input
                type="checkbox"
                defaultChecked={permission.defaultChecked}
                className="w-5 h-5 accent-orange rounded-md cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">
                  {permission.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {permission.description}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors text-sm"
          >
            Cancelar
          </button>
          <DefaultButton
            text="Salvar Permissões"
            another_size="w-auto px-5 h-11"
            another_padding="py-0"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default PermissionsModal;
