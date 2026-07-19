import React, { useEffect, useState } from 'react'
import '../styles/saved.css'
import '../styles/profile.css'
import axios from 'axios'
import ShotFeed from '../components/ShotFeed'
import { useVideoActions } from '../hooks/useVideoActions'
import { replace, useNavigate, useParams } from 'react-router-dom'
import apiClient from '../utils/apiClient'
import VideoSkeleton from '../components/VideoSkeleton'

const Saved = () => {
    const [videos, setVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { shotId } = useParams()
    const isFeedOpen = Boolean(shotId)
    const navigate = useNavigate()

    useEffect(() => {
        apiClient.get("/shot/save")
            .then(response => {
                setVideos(response.data.savedShot)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        if (!isLoading && shotId) {
            const isVideoInList = videos.some(video =>
                video._id === shotId
            )
            if (!isVideoInList) {
                navigate(`/shot/${shotId}`, { replace: true })
            }
        }
    }, [shotId, videos, navigate, isLoading])


    const removeSaved = async (item) => {
        try {
            apiClient.post("/shot/save", { shotId: item._id })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, isSaved: false, saveCount: Math.max(0, (v.saveCount ?? 1) - 1) } : v))
        } catch {
            // noop
        }
    }


    const handleVideoInView = (inViewVideoId) => {
        const newUrl = `/saved/${inViewVideoId}`;
        window.history.replaceState(null, '', newUrl);

    }

    const handleVideoClick = (shotId) => {
        navigate(`/saved/${shotId}`)
    }

    if (isFeedOpen) {
        return (
            <ShotFeed
                items={videos}
                customSetVideos={setVideos}
                emptyMessage="Video Not Available."
                targetId={shotId}
                onVideoInView={handleVideoInView}
            />
        )
    }

    return (
        <div className='saved-page'>
            <p className='saved-head'> Your Saved Shot </p>

            <hr className="profile-sep" />

            {isLoading ? (
                <VideoSkeleton />
            ) : (
                <div className='profile-grid'>

                    {!isLoading && videos.length === 0 && (
                        <div className="empty-state">
                            <p>No saved videos yet</p>
                        </div>
                    )}
                    {videos.map((v) => (
                        <div key={v._id} className="profile-grid-item" onClick={() => handleVideoClick(v._id)}>
                            <video
                                className="profile-grid-video"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                src={v.video} muted ></video>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Saved