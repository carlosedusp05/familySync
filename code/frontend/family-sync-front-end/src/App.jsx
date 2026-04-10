import DefaultButton from "./components/DefaultButton";
import DefaultTextField from "./components/DefaultTextField";

function App() {
  return (
    <div className="flex ">
      <DefaultButton text="Login" horizontal="70px" vertical="16px" />

      <div className="w-[30%] h-[30%] flex justify-center items-center">
        <DefaultTextField placeholder="BAH TCHÊ" src="Eye.png" alt="oio" />
      </div>
    </div>
  );
}

export default App;
