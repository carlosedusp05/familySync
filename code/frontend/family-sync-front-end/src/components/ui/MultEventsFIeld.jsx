import ItemEvents from "./ItemEvents";

function MultEventsField({ events = [] }) {
  return events.map((event, index) => {
    return (
      <ItemEvents
        key={index}
        title={event.title}
        hours={event.hours}
        date={event.date}
        desc={event.desc}
        creator={event.creator}
      />
    );
  });
}

export default MultEventsField;
