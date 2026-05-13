import ItemEvents from "./ItemEvents";

function MultEventsField({ events = [], onEdit }) {
  return events.map((event, index) => {
    return (
      <ItemEvents
        key={index}
        title={event.title}
        hours={event.hours}
        date={event.date}
        desc={event.desc}
        creator={event.creator}
        onEdit={() => onEdit(event, true)}
      />
    );
  });
}

export default MultEventsField;
