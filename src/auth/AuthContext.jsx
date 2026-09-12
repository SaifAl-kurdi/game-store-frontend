import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../api/client";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem("accessToken")
  );

  async function login(username, password) {
    const response = await api.post(
      "/auth/login/",
      {
        username,
        password,
      }
    );

    const {
      access,
      refresh,
    } = response.data;

    sessionStorage.setItem("accessToken", access);
    sessionStorage.setItem("refreshToken", refresh);

    setAccessToken(access);
  }


  function logout() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    setAccessToken(null);
  }


  const value = {
    accessToken,
    isAuthenticated: Boolean(accessToken),
    login,
    logout,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}