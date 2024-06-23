// src/App.js
import { useColorMode, Button, Box } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
// import ActiveOrders from "./components/ActiveOrders";
import CompleteOrders from "./components/CompleteOrders";
import Order from "./components/Order";
// import NewSaleOrder from "./components/NewSaleOrder"; 


function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  const isAuthenticated = () => {
    return localStorage.getItem("authenticated") === "true";
  };

  return (
    <Box>
      <header>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </header>
      <Router>
      <Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/order-page"
    element={
      isAuthenticated() ? <Order /> : <Navigate to="/login" />
    }
  />
  <Route
    path="/complete-orders"
    element={
      isAuthenticated() ? <CompleteOrders /> : <Navigate to="/login" />
    }
  />
  {/* <Route path="/new-sale-order" element={<NewSaleOrder />} /> Add this line */}
  <Route path="*" element={<Navigate to="/login" />} />
</Routes>

      </Router>
    </Box>
  );
}

export default App;
