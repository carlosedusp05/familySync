import DefaultTextField from "./DefaultTextField";

function MultTextField({ text_fields = [] }) {
  return text_fields.map((text_field, index) => {
    return (
      <DefaultTextField
        key={index}
        type={text_field.type}
        placeholder={text_field.placeholder}
        src={text_field.src}
        alt={text_field.alt}
      />
    );
  });
}

export default MultTextField;
