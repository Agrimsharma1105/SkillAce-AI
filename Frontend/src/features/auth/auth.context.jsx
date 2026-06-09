import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider =({children})=>{
   const [user, setUser] = useState(null);
   const [loading, setloading] = useState(false);

 
   return(
    <AuthContext.Provider value={{user,setUser,loading,setloading}}>
     {children}
    </AuthContext.Provider>
   )
}