import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<h1>Login route</h1>} />
      <Route path="/register" element={<h1>Register route</h1>} />
    </Routes>
  );
}

export default AppRoutes;