import { useContext, useEffect } from "react"
import {AuthContext} from '../auth.context'
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = ()=>{
   const context = useContext(AuthContext)
   const {user,setUser,loading,setloading} = context

   const handlelogin = async({email,password})=>{
      setloading(true)
      try {
          const data = await login({email,password})
      setUser(data.user)
      } catch (error) {
        
      }finally{
       setloading(false)
      }
   }
   
   const handleRegister =async({username,email,password})=>{
      setloading(true)
      try {
        const response = await register({username,email,password})
      setUser(response.user)
      } catch (error) {
        
      }finally{
        setloading(false)
      }
   }

   const handleLogout=async()=>{
    setloading(true);
    try {
          const data = await logout()
    setUser(null)
    } catch (error) {
        
    }finally{
    setloading(false)
    }
   }

     useEffect(()=>{
     async function getandSetUser(){
     try {
      const data = await getMe();
     setUser(data.user)
     } catch (error) {
       setloading(false);
     }
     }
     getandSetUser()
   },[])

   return{user,loading ,handlelogin,handleLogout,handleRegister}
}



//try and catch m islie wrap krte hai hum bcs agr manlo koi error ata hai in case to hum directly 
//sirf loading pr hi na rehjaye