import ItemNotification from "./ItemNotication";

function MultTextField({ notifications = [] }) {
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

export default MultTextField;
