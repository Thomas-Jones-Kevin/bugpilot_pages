import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const MOCK_USERS = [
  { _id:"1", name:"Admin User", email:"admin@test.com", password:"123", role:"admin" },
  { _id:"2", name:"Dev User",   email:"dev@test.com",   password:"123", role:"developer" },
  { _id:"3", name:"QA Tester",  email:"qa@test.com",    password:"123", role:"qa" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("mockUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    localStorage.setItem("mockUser", JSON.stringify(found));
    setUser(found);
    return found;
  };

  const register = async (name, email, password, role) => {
    const newUser = { _id: Date.now().toString(), name, email, role };
    localStorage.setItem("mockUser", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("mockUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);