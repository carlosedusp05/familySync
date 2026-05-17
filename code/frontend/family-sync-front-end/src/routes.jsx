import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "./App";
import RootLayout from "./components/ui/RootLayout";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import InicioScreen from "./screens/InicioScreen";
import StartScreen from "./screens/StartScreen";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // ==========================================
      // ROTA RAIZ (Livre)
      // Se apagar a URL, cai aqui e vai pro "start"
      // ==========================================
      {
        path: "/",
        element: <Navigate to="/auth/start" replace />,
      },

      // ==========================================
      // ÁREA PÚBLICA (Auth)
      // ==========================================
      {
        path: "/auth",
        children: [
          { path: "start", element: <InicioScreen /> },
          {
            path: "login",
            lazy: () =>
              import("./screens/LoginScreen").then((m) => ({
                Component: m.default,
              })),
          },
          {
            path: "register",
            lazy: () =>
              import("./screens/RegisterScreen").then((m) => ({
                Component: m.default,
              })),
          },
          {
            path: "recovery",
            lazy: () =>
              import("./screens/RememberPassScreen").then((m) => ({
                Component: m.default,
              })),
          },
        ],
      },

      // ==========================================
      // ÁREA PROTEGIDA
      // Tudo aqui dentro precisa de login
      // ==========================================
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <App />,
            children: [
              { index: true, element: <StartScreen /> },
              {
                path: "calendar",
                lazy: () =>
                  import("./screens/CalendarScreen").then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: "finance",
                lazy: () =>
                  import("./screens/FinancierScreen").then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: "family",
                children: [
                  {
                    index: true,
                    lazy: () =>
                      import("./screens/ManageFamily").then((m) => ({
                        Component: m.default,
                      })),
                  },
                  {
                    path: "add",
                    lazy: () =>
                      import("./screens/AddFamilyScreen").then((m) => ({
                        Component: m.default,
                      })),
                  },
                  {
                    path: "info",
                    lazy: () =>
                      import("./screens/InfoFamiliarScreen").then((m) => ({
                        Component: m.default,
                      })),
                  },
                ],
              },
              {
                path: "notifications",
                lazy: () =>
                  import("./screens/NotificationsScreen").then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: "lists",
                lazy: () =>
                  import("./screens/ListScreen").then((m) => ({
                    Component: m.default,
                  })),
              },
              {
                path: "profile",
                lazy: () =>
                  import("./screens/PerfilScreen").then((m) => ({
                    Component: m.default,
                  })),
              },
            ],
          },
        ],
      },

      // ==========================================
      // 404 - NÃO ENCONTRADO
      // ==========================================
      {
        path: "*",
        element: (
          <div className="bg-zinc-950 h-screen flex items-center justify-center text-5xl text-white">
            404 - Página não encontrada
          </div>
        ),
      },
    ],
  },
]);
