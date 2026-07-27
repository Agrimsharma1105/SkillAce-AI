import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider =({children})=>{
   const [user, setUser] = useState(null);
   const [loading, setloading] = useState(false);
  useEffect(() => {
        async function getAndSetUser() {
            setloading(true);

            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                console.log(error);
                setUser(null);
            } finally {
                setloading(false);
            }
        }

        getAndSetUser();
    }, []);
 
   return(
    <AuthContext.Provider value={{user,setUser,loading,setloading}}>
     {children}
    </AuthContext.Provider>
   )
}