import { Outlet } from "react-router-dom";

export default function App() {
  const userData = { nome: "Vitor Miguel", email: "vitor@exemplo.com" };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1">
        <Outlet context={userData} />
      </main>
    </div>
  );
}
