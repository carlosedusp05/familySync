// import DefaultButton from "./components/DefaultButton";
// import CardLogin from "./components/CardLogin";
// import DefaultTextField from "./components/DefaultTextField";
// import CardRememberPass from "./components/CardRememberPass";
// import AccountRegister from "./components/AccountRegister";
// import AccountEdit from "./components/AccountEdit";
import RememberPassScreen from "./screens/RememberPassScreen";
// import SideBarNavegation from "./components/SidebarNavigation";
// import { eyeIcon } from "./assets";

import LoginScreen from "./screens/LoginScreen";
import InicioScreen from "./screens/InicioScreen";
import RegisterScreen from "./screens/RegisterScreen";

function App() {
  // return <RegisterScreen />;

  return <RememberPassScreen />;

  // <div className="flex gap-20 flex-wrap">
  //   <DefaultButton
  //     text="Login"
  //     horizontal="70px"
  //     vertical="16px"
  //     theme={true}
  //   />
  //   <DefaultButton
  //     text="Cancelar"
  //     horizontal="70px"
  //     vertical="16px"
  //     theme={false}
  //     border={true}
  //   />
  //   <DefaultButton
  //     text="Sair da Conta"
  //     horizontal="50px"
  //     vertical="0px"
  //     theme={true}
  //     border={true}
  //     logout_image={true}
  //   <DefaultButton
  //     text="Confirmar"
  //     horizontal="70px"
  //     vertical="16px"
  //     theme={true}
  //     most_radius={true}
  //   />
  //   <div className="w-[30%] h-[30%] flex justify-center items-center">
  //     <DefaultTextField
  //       placeholder="BAH TCHÊ"
  //       type="text"
  //       src={eyeIcon}
  //       alt="oio"
  //     />
  //   </div>
  //   =======
  //   <CardLogin />
  //   <CardRememberPass />
  //   <AccountRegister />
  //   <AccountEdit />
  //   <SideBarNavegation currentPage="lista" />
  // </div>
}

export default App;
