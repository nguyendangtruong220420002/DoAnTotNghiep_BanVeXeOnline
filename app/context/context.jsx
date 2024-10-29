import { createContext, useState, useEffect } from "react";

export const globalContext = createContext({});

export const GlobalContext = ({ children }) => {
  const [user, setUser] = useState();

  const globalData = {
    user,
  };

  const globalHandler = { setUser};

  return (
    <globalContext.Provider value={{ globalData, globalHandler }}>
      {children}
    </globalContext.Provider>
  );
};