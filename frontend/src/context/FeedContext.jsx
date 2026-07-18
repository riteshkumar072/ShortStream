import { createContext, useState} from "react";


export const FeedContext = createContext();

export const FeedProvider = ({children}) =>{
    const [videos, setVideos] = useState([])

    return ( 
    <FeedContext.Provider value={{videos, setVideos}}>
        {children}
    </FeedContext.Provider>
    )
}