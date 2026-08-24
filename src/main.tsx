import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { GarageProvider } from "./context/GarageContext";
import { CartProvider } from "./context/CartContext";
import { Home } from "./pages/Home";
import { Garage } from "./pages/Garage";
import { Catalog } from "./pages/Catalog";
import { Services } from "./pages/Services";
import { StoPage } from "./pages/StoPage";
import { Cart } from "./pages/Cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "garage", element: <Garage /> },
      { path: "catalog", element: <Catalog /> },
      { path: "services", element: <Services /> },
      { path: "sto/:id", element: <StoPage /> },
      { path: "cart", element: <Cart /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GarageProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </GarageProvider>
  </StrictMode>
);
