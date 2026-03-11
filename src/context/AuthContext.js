import { createContext, useContext, useState } from "react";
import  axios  from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const userPath = "http://localhost:8080/api/user"

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("mockUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const reqUser = {
      email,
      password
    }
    const res = await axios.post(`${userPath}/login`,reqUser)
    const found = res.data;
    localStorage.setItem("mockUser", JSON.stringify(found));
    setUser(found);
    return found;
  };

  const register = async (name, email, password, role, developerType, specialization) => {
    const reqUser = {
      name: name,
      email: email,
      password: password,
      role: role,
      developerType: developerType,
      specialization: specialization
    }
    const res = await axios.post(`${userPath}/signup`, reqUser);
    const newUser = res.data;
    localStorage.setItem("mockUser", JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("mockUser");
    setUser(null);
  };

  const getAllUsers = async () => {
    const res = await axios.get(userPath);
    return res.data;
  }

  const getAllUsersType = async (type) => {
    const res = await axios.get(`${userPath}/${type}`);
    return res.data;
  }

  return (
    <AuthContext.Provider value={{ user, loading: false, login, register, logout, getAllUsers, getAllUsersType}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);