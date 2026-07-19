import apiClient from "../utils/apiClient";
import { createContext , useState, useEffect} from "react";

export const UploadContext = createContext();

export const UploadProvider = ({children}) =>{
    const [uploadState, setUploadState] = useState({isUploading: false, message:"", type:""})

    async function uploadVideo(formData) {
        setUploadState({isUploading:true,message:"Uploading your Shot ...", type:"info"})
        try {
            
            const response = await apiClient.post('/shot/create',formData)

            setUploadState({ isUploading: false, message: "Shot Uploaded Successfully!", type: "success" });
            console.log(response.data)
            setTimeout(() => {
                setUploadState({ isUploading: false, message: "", type: "" });
            }, 3000);
        } catch (error) {
            console.error("upload error",error)
            setUploadState({isUploading:false, message:"Upload failed! Please try again" , type: "error"})
            setTimeout(() => {
                setUploadState({ isUploading: false, message: "", type: "" });
            }, 4000);
        }
    }

    return( <UploadContext.Provider value={{uploadState,uploadVideo}}>
        {children}
        {uploadState.message &&(
            <div className={`global-toast ${uploadState.type}`}>
                {uploadState.message}
            </div>
        )}
    </UploadContext.Provider>
)}