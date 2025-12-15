import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Feedback from "./pages/Feedback";
import Auth from "./pages/Auth";

import axios from "axios";
import { productLoader } from "./loaders/productLoader";

/* ---------- LAYOUT ---------- */
const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};



/* ---------- ROUTER ---------- */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: productLoader, // ✅ CORRECT PLACE
      },
      {
        path: "inventory",
        element: <Inventory />,
        loader: productLoader,
      },
      {
        path: "billing",
        element: <Billing />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "alerts",
        element: <Alerts />,
      },
      {
        path: "feedback",
        element: <Feedback />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
    ],
  },
]);

/* ---------- APP ---------- */
export default function App() {
  return <RouterProvider router={router} />;
}
