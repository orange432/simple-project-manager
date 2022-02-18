import { createContext, useContext, useState } from "react";

const AuthContext = createContext({})

export const AuthWrapper: React.FC = ({children}) => {
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")

  const Authenticate = () => {
    setLoading(true);
    fetch("/api/auth/authenticate",{credentials: "include"})
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        setUserId(data.user.userId)
        setDisplayName(data.user.displayName)
        setEmail(data.user.email)
        setUsername(data.user.username)
        setLoading(false)
      }else{
        window.location.href = "/login"
      }
    })
  }

  const values = {
    Authenticate,
    loading,
    email,
    username,
    userId,
    displayName
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)