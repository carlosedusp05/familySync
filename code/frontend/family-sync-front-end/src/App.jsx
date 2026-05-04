// import DefaultButton from "./components/DefaultButton";
// import CardLogin from "./components/CardLogin";
// import DefaultTextField from "./components/DefaultTextField";
// import CardRememberPass from "./components/CardRememberPass";
// import AccountRegister from "./components/AccountRegister";
// import AccountEdit from "./components/AccountEdit";
import RememberPassScreen from "./screens/RememberPassScreen";
import CardNotication from "./components/ui/ItemNotication";

import LoginScreen from "./screens/LoginScreen";
import InicioScreen from "./screens/InicioScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MainLayout from "./layouts/Mainlayout";
import StartScreen from "./screens/StartScreen";
import FinancierScreen from "./screens/FinancierScreen";
import AddExpenses from "./screens/AddExpenses";
import CalendarScreen from "./screens/CalendarScreen";
import ItemEvents from "./components/ui/ItemEvents";
import ManageFamily from "./screens/ManageFamily";
import AddFamilyScreen from "./screens/AddFamilyScreen";
import InfoFamiliarScreen from "./screens/InfoFamiliarScreen";
import ListScreen from "./screens/ListScreen";

function App() {
  // return <RegisterScreen />;
  // return <RememberPassScreen />;
  // return <MainLayout />;
  // return <AddExpenses is_edit_expenses={false} />;
  return <RegisterScreen />;
  // return <ManageFamily />
  // return <AddExpenses />;
  // return <FinancierScreen />;
  // return <StartScreen />;
  return <CalendarScreen />;
  // return <InicioScreen />;
  // return <LoginScreen />;
  // return <ItemEvents />;
  // return <InfoFamiliarScreen />;
  // return <AddFamilyScreen />;
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
  // <div className="bg-black">
  //     <ItemNotication
  //       title="goiaba"
  //       text="xsadsccccccadddccccccccczxnhcsb cguggcfdvbhdbbvchx hvc xvchjxb chhjvccccccccccccccccccccccccccccccccccccc hcx bhjjjjhb chb hjjjjjj chhcbbhdhbvbfhdvbvfhabhdfbvhjb cdsacsda"
  //       time="10/02/2029"
  //     />
  //     ;
  //   </div>
  // </div>
}

export default App;
