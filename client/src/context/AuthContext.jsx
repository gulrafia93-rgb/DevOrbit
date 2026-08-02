import { createContext, useReducer, useContext, useEffect } from "react";
import { registerUser, loginUser } from "../services/authService";

const AuthContext = createContext();

const initialState = { user: null, token: null, loading: true };

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload.user, token: action.payload.token, loading: false };
    case "LOGOUT":
      return { user: null, token: null, loading: false };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On first load, check if a token/user was saved from a previous session
  useEffect(() => {
    const savedToken = localStorage.getItem("devorbit_token");
    const savedUser = localStorage.getItem("devorbit_user");
    if (savedToken && savedUser) {
      dispatch({ type: "LOGIN", payload: { token: savedToken, user: JSON.parse(savedUser) } });
    } else {
      dispatch({ type: "STOP_LOADING" });
    }
  }, []);

  const register = async (formData) => {
    const data = await registerUser(formData);
    localStorage.setItem("devorbit_token", data.token);
    localStorage.setItem("devorbit_user", JSON.stringify(data.user));
    dispatch({ type: "LOGIN", payload: data });
    return data;
  };

  const login = async (formData) => {
    const data = await loginUser(formData);
    localStorage.setItem("devorbit_token", data.token);
    localStorage.setItem("devorbit_user", JSON.stringify(data.user));
    dispatch({ type: "LOGIN", payload: data });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("devorbit_token");
    localStorage.removeItem("devorbit_user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}