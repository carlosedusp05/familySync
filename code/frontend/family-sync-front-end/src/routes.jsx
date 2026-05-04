import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layout
import App from "./App";

import InicioScreen from "./screens/InicioScreen";
import StartScreen from "./screens/StartScreen";

const LoginScreen = lazy(() => import("./screens/LoginScreen"));
const RegisterScreen = lazy(() => import("./screens/RegisterScreen"));
const RememberPassScreen = lazy(() => import("./screens/RememberPassScreen"));
const CalendarScreen = lazy(() => import("./screens/CalendarScreen"));
const FinancierScreen = lazy(() => import("./screens/FinancierScreen"));
const AddExpenses = lazy(() => import("./screens/AddExpenses"));
const ManageFamily = lazy(() => import("./screens/ManageFamily"));
const AddFamilyScreen = lazy(() => import("./screens/AddFamilyScreen"));
const InfoFamiliarScreen = lazy(() => import("./screens/InfoFamiliarScreen"));
const NotificationsScreen = lazy(() => import("./screens/NotificationsScreen"));
const ListScreen = lazy(() => import("./screens/ListScreen"));

const Loading = () => (
  <div className="bg-zinc-950 h-screen w-full flex items-center justify-center text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      <p className="text-orange font-medium">Carregando FamilySync...</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/start" replace />,
  },
  {
    path: "/auth",
    children: [
      { path: "start", element: <InicioScreen /> },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loading />}>
            <LoginScreen />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterScreen />
          </Suspense>
        ),
      },
      {
        path: "recovery",
        element: (
          <Suspense fallback={<Loading />}>
            <RememberPassScreen />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <App />,
    children: [
      { index: true, element: <StartScreen /> },
      {
        path: "calendar",
        element: (
          <Suspense fallback={<Loading />}>
            <CalendarScreen />
          </Suspense>
        ),
      },
      {
        path: "finance",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <FinancierScreen />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <AddExpenses />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "family",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <ManageFamily />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <AddFamilyScreen />
              </Suspense>
            ),
          },
          {
            path: "info/:id",
            element: (
              <Suspense fallback={<Loading />}>
                <InfoFamiliarScreen />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<Loading />}>
            <NotificationsScreen />
          </Suspense>
        ),
      },
      {
        path: "lists",
        element: (
          <Suspense fallback={<Loading />}>
            <ListScreen />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="bg-zinc-950 h-screen flex items-center justify-center text-white">
        404 - Página não encontrada
      </div>
    ),
  },
]);
