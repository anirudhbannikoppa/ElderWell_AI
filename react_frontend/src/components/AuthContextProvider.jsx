// Create a React context to share authentication/filter state across the app
import { createContext, useState } from "react";

export const AuthContext = createContext();

// Provider component wrapping parts of the app that need access to `filter`
const AuthContextProvider = ({ children }) => {
  // `filter` state is exposed so consumers can read and update it
  const [filter, setFilter] = useState("");
  return (
    <AuthContext.Provider value={{ filter, setFilter }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
