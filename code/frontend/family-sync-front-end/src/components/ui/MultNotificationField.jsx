import ItemNotification from "./ItemNotication";

function MultNotificationField({ notifications = [] }) {
  return notifications.map((notification, index) => {
    return (
      <ItemNotification
        key={index}
        title={notification.title}
        text={notification.text}
        time={notification.time}
      />
    );
  });
}

export default MultNotificationField;
