import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import VideoSkeleton from "./VideoSkeleton";

const ProtectedRoute = () =>{

    const {loggedUserId, isLoading} = useContext(AuthContext)

    if(isLoading){
        return<VideoSkeleton />;
    }

    if(!loggedUserId){
        return <Navigate to="/login" replace />
    }

    return <Outlet/>;
}

export default ProtectedRoute