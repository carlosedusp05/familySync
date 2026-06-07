import ItemNotication from "./ItemNotication";

function MultNotificationField({ notifications = [] }) {
  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.data) - new Date(a.data);
  });

  return sortedNotifications.map((notification) => {
    return (
      <ItemNotication
        key={notification.id_notificacao}
        title={notification.titulo}
        text={notification.descricao}
        time={notification.data}
      />
    );
  });
}

export default MultNotificationField;
