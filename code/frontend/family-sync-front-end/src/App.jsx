import DefaultButton from "./components/DefaultButton";

function App() {
  return (
    <div>
      <DefaultButton
        text="Login"
        horizontal="70px"
        vertical="16px"
        theme={true}
      />
      <DefaultButton
        text="Cancelar"
        horizontal="70px"
        vertical="16px"
        theme={false}
        border={true}
      />
      <DefaultButton
        text="Sair da Conta"
        horizontal="50px"
        vertical="0px"
        theme={true}
        border={true}
        logout_image={true}
      />
      <DefaultButton
        text="Confirmar"
        horizontal="70px"
        vertical="16px"
        theme={true}
        most_radius={true}
      />
    </div>
  );
}

export default App;
