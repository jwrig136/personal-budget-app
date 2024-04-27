import React, { useEffect, useState } from "react";
import {auth} from "./firebase.js"
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setPending(false)
    });
    
    return () => { unsubscribe() }
  }, []);

  if(pending){
    return <>Loading...</>
  }
  return (
    <AuthContext.Provider
      value={{
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};