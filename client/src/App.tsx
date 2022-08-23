import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Buyer from "./components/Buyer";
import { Home } from "./components/Home";
import { Layout } from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import Seller from "./components/Seller";
import Unknown from "./components/Unknown";
import AuthService from "./services/auth.service";

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }
    >
      <Route path="/buyer" element={<Buyer />} />
      <Route path="/seller" element={<Seller />} />
      <Route path="/unknown" element={<Unknown />} />
    </Route>
  </Routes>
);

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = AuthService.getCurrentUser();

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
