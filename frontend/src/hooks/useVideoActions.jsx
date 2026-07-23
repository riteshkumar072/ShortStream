import apiClient from '../utils/apiClient';
import { useContext } from 'react';
import { FeedContext } from '../context/FeedContext';
import toast from 'react-hot-toast';

export const useVideoActions = (customSetVideos = null) => {
    const { setVideos: contextSetVideos } = useContext(FeedContext)
    const setVideos = customSetVideos || contextSetVideos;

    async function likeVideo(item) {
        setVideos((prev) => prev.map((v) =>
            v._id === item._id ? {
                ...v, likeCount: v.isLiked ? Math.max(0, (v.likeCount) - 1) : v.likeCount + 1,
                isLiked: !v.isLiked
            } : v))
        try {
            await apiClient.post("/shot/like", { shotId: item._id }, { hideLoader: true })
        } catch (error) {
            console.error("like failed ", error)
            setVideos((prev) => prev.map((v) => v._id === item._id ? {
                ...v, likeCount: v.isLiked ? v.likeCount + 1 : Math.max(0, v.likeCount - 1),
                isLiked: !v.isLiked
            } : v))
        }

    }

    async function saveVideo(item) {
        setVideos(prev => prev.map((v) =>
            v._id === item._id ? {
                ...v, saveCount: v.isSaved ? Math.max(0, (v.saveCount) - 1) : v.saveCount + 1,
                isSaved: !v.isSaved
            } : v))
        try {
            await apiClient.post("/shot/save", { shotId: item._id }, { hideLoader: true })

        } catch (err) {
            console.error("save failed", err)
            setVideos(prev => prev.map((v) =>
                v._id === item._id ? {
                    ...v, saveCount: v.isSaved ? v.saveCount + 1 : Math.max(0, v.saveCount - 1),
                    isSaved: !v.isSaved
                } : v))

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