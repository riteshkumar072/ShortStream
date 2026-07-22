import apiClient from '../utils/apiClient';
import { useContext } from 'react';
import { FeedContext } from '../context/FeedContext';
import toast from 'react-hot-toast';

export const useVideoActions = (customSetVideos = null) => {
    const { setVideos: contextSetVideos } = useContext(FeedContext)
    const setVideos = customSetVideos || contextSetVideos;

    async function likeVideo(item) {
        try {
            const response = await apiClient.post("/shot/like", { shotId: item._id } , { hideLoader: true })

            if (response.data.like) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1, isLiked: true } : v))
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 1) - 1), isLiked: false } : v))
            }
        } catch (error) {
            console.error("like failed ", error)
        }

    }

    async function saveVideo(item) {
        try{const response = await apiClient.post("/shot/save", { shotId: item._id } ,{ hideLoader: true })

        if (response.data.save) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, saveCount: v.saveCount + 1, isSaved: true } : v))
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, saveCount: Math.max(0, (v.saveCount ?? 1) - 1), isSaved: false } : v))
        }
    }catch(err){
        console.error("save failed", err)
    }
    }

    async function deleteVideo(item) {
        try{const response = await apiClient.delete(`/shot/delete/${item._id}`, { hideLoader: true })
        if (response.status === 200) {
            setVideos((prevVideos) => prevVideos.filter((video) => video._id !== item._id));
            toast.success(response.data.message)
        }}catch(err){
            console.error(err)
        }
    }

    async function shareVideo(item) {
        const shareData = {
            text: item.description,
            url: `${window.location.origin}/shot/${item._id}`
        }

        if (navigator.share) {
            try {
                navigator.share(shareData)
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Copy failed", err);
            }
        }
    }


    async function getComment(shotId) {
        try {
            const response = await apiClient.get(`/shot/comment/${shotId}`, { hideLoader: true })

            return response.data.comment
        } catch (err) {
            console.error("Comment cannot fetched", err)
            return []
        }

    }

    async function createComment(shotId, text) {
        try {
            const response = await apiClient.post('/shot/comment', { shotId, text }, { hideLoader: true })
            return response.data.comment;
        } catch (error) {
            console.error("can't create comment",error)
        }
    }


    return { saveVideo, likeVideo, deleteVideo, shareVideo, getComment, createComment };
};