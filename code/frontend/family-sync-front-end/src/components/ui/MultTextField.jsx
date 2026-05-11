import DefaultTextField from "./DefaultTextField";

function MultTextField({ text_fields = [], variant = "default" }) {
  return text_fields.map((text_field, index) => {
    return (
      <DefaultTextField
        key={index}
        variant={text_field.variant || variant}
        type={text_field.type}
        placeholder={text_field.placeholder}
        src={text_field.src}
        alt={text_field.alt}
        isPassword={text_field.isPassword}
        onChange={text_field.onChange}
        value={text_field.value}
      />
    );
  });
}

export default MultTextField;
