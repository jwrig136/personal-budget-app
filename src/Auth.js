import React, { useEffect, useState } from "react";
import {auth} from "./firebase.js"
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log(currentUser);
        console.log("here");
      setUser(currentUser);
    });
    console.log(user);
    
    return () => { unsubscribe() }
  }, []);


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