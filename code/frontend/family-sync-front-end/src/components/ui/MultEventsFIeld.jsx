import ItemEvents from "./ItemEvents";

function MultEventsField({ events = [], onEdit }) {
  return events.map((event, index) => {
    return (
      <ItemEvents
        key={index}
        title={event.titulo}
        hours={event.hora}
        date={event.data}
        desc={event.descricao}
        creator={event.creator}
        onEdit={() => onEdit(event, true)}
      />
    );
  });
}

export default MultEventsField;
