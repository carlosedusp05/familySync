import DefaultButton from "./components/DefaultButton";
import DefaultTextField from "./components/DefaultTextField";
import eyeIcon from "./assets/Eye.png";

function App() {
  return (
    <div className="flex gap-20">
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
      <div className="w-[30%] h-[30%] flex justify-center items-center">
        <DefaultTextField
          placeholder="BAH TCHÊ"
          type="text"
          src={eyeIcon}
          alt="oio"
        />
      </div>
    </div>
  );
}

export default App;
