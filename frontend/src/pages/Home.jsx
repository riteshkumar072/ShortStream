import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import '../styles/shots-feed.css'
import ShotFeed from '../components/ShotFeed'
import VideoSkeleton from '../components/VideoSkeleton';
import { useVideoActions } from '../hooks/useVideoActions';
import { useContext } from 'react';
import { FeedContext } from '../context/FeedContext';
import { data, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const Home = () => {
    const { videos, setVideos} = useContext(FeedContext)
    const { shotId } = useParams()
    const [isDataLoading, setIsDataLoading] = useState(videos.length === 0);


    const handleVideoInView = (inViewVideoId) => {
        const newUrl = `/shot/${inViewVideoId}`;
        window.history.replaceState(null, '', newUrl);

    }

    useEffect(() => {
        if (videos.length === 0) {
            const currentTargetId = shotId || ""

            apiClient.get(`/shot?targetId=${currentTargetId}`)

                .then(response => {
                    console.log(response.data);

                    setVideos(response.data.shot)
                }).finally(()=>setIsDataLoading(false))
        }
    }, [videos, shotId])

    if(isDataLoading){
        return <VideoSkeleton/>
    }


    return (<>
        <ShotFeed
            items={videos}
            emptyMessage="No videos available."
            targetId={shotId}
            onVideoInView={handleVideoInView}
        />
    </>)
}

export default Home