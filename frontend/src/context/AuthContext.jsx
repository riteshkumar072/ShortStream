import apiClient from "../utils/apiClient";
import {useState, createContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserName, setLoggedUserName] = useState(null)
    const [loggedUserAbout, setLoggedUserAbout] = useState(null)
    const [loggedUserProfileIMG, setloggedUserProfileIMG] = useState('')
    const [isLoading, setIsLoading] = useState(true);    

    useEffect(() => {
      apiClient.get("/auth/me" , { hideToast: true })
        .then((response)=>{
            setLoggedUserName(response.data.user.name)
            setLoggedUserId(response.data.user._id)
            setLoggedUserAbout(response.data.user.about)
            setloggedUserProfileIMG(response.data.user.profileImage)
        })
        .catch(()=>{
            setLoggedUserId(null)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }, [])

    return (
        <AuthContext.Provider value={{loggedUserId,setLoggedUserId, loggedUserName,setLoggedUserName , loggedUserAbout,setLoggedUserAbout,loggedUserProfileIMG,setloggedUserProfileIMG, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

