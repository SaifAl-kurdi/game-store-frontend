import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductsPage from "./pages/ProductsPage";
import ReceiptPage from "./pages/ReceiptPage";


function protect(page) {
  return (
    <ProtectedRoute>
      {page}
    </ProtectedRoute>
  );
}


export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/products"
        element={protect(<ProductsPage />)}
      />

      <Route
        path="/products/:productId"
        element={protect(
          <ProductDetailsPage />
        )}
      />

      <Route
        path="/receipts/:receiptNumber"
        element={protect(
          <ReceiptPage />
        )}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/products"
            replace
          />
        }
      />
    </Routes>
  );
}