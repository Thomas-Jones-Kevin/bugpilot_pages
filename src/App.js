import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BugProvider } from "./context/BugContext";

import Landing    from "./pages/Landing";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Dashboard  from "./pages/Dashboard";
import BugList    from "./pages/BugList";
import BugDetails from "./pages/BugDetails";
import CreateBug  from "./pages/CreateBug";
import TaskBoard  from "./pages/TaskBoard";
import AdminPanel from "./pages/AdminPanel";
import Profile    from "./pages/Profile";

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user)   return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/"            element={!user ? <Landing />  : <Navigate to="/dashboard" />} />
      <Route path="/login"       element={!user ? <Login />    : <Navigate to="/dashboard" />} />
      <Route path="/register"    element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/bugs"        element={<PrivateRoute><BugList /></PrivateRoute>} />
      <Route path="/bugs/new"    element={<PrivateRoute roles={["qa","admin"]}><CreateBug /></PrivateRoute>} />
      <Route path="/bugs/:id"    element={<PrivateRoute><BugDetails /></PrivateRoute>} />
      <Route path="/board"       element={<PrivateRoute><TaskBoard /></PrivateRoute>} />
      <Route path="/admin"       element={<PrivateRoute roles={["admin"]}><AdminPanel /></PrivateRoute>} />
      <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="*"            element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BugProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <AppRoutes />
        </BugProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}