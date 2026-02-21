import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import AlertsPage from "../pages/Alerts";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Root from "./Root";

import MyJobsPage from "../pages/MyJobs"; // NEW: Import MyJobsPage
import ProfilePage from "../pages/Profile"; // NEW: Import ProfilePage

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <AuthPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: "dashboard", element: <Dashboard /> },
              { path: "alerts", element: <AlertsPage /> },
              { path: "my-jobs", element: <MyJobsPage /> },
              { path: "profile", element: <ProfilePage /> }, // NEW: Add Profile route
            ],
          },
        ],
      },
    ],
  },
]);
