import axios from "axios";
import nProgress from "nprogress";
import toast from "react-hot-toast";

nProgress.configure({ showSpinner: false, speed: 300 })


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:3000/api",
    withCredentials: true,
})


apiClient.interceptors.request.use(
    (config) => {
        if (!config.hideLoader) {
            nProgress.start();
        }
        return config
    },
    (error) => {
        nProgress.done();
        return Promise.reject(error);
    }
)


apiClient.interceptors.response.use(
    (response) => {
        nProgress.done()
        return response;
    },
    (error) => {
        nProgress.done();

        if(error.config && error.config.hideToast){
            return Promise.reject(error);
        }

        if (!error.response) {
            toast.error("Please check your internet connection.")
        }
        else if (error.response.status >= 500) {
            toast.error("Server Down")
        }
        else if (error.response.status === 401) {
            toast.error(error.response.data.message)
        }
        else if (error.response.status === 403) {
            toast.error("Guest users cannot perform this action.");
        }
        return Promise.reject(error);
    }
)

export default apiClient;