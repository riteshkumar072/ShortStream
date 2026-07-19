import React, { useState, useEffect, useContext , useRef} from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/profile.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useVideoActions } from '../hooks/useVideoActions'
import ShotFeed from '../components/ShotFeed'
import apiClient from '../utils/apiClient'

const Profile = () => {
    const { id, shotId } = useParams()
    const navigate = useNavigate()
    const { loggedUserId} = useContext(AuthContext)

    const isMyProfile = !id || id === loggedUserId;

    const [profile, setProfile] = useState(null)
    const [profileVideos, setProfileVideos] = useState([])

    useEffect(() => {
        if (isMyProfile) {
            apiClient.get('/user/myprofile')
                .then(response => {
                    setProfile(response.data.user)
                    setProfileVideos(response.data.user.myItem)
                })
        }
        else {
            apiClient.get(`/user/${id}`)
                .then(response => {
                    setProfile(response.data.user)
                    setProfileVideos(response.data.user.itemByUser)
                })
        }
    }, [isMyProfile, id])


    //If profile's SHot open
    const isFeedOpen = Boolean(shotId)

    const onOpenVideo = (shotId) => {
        navigate(`/user/${id}/shot/${shotId}`)
    }
    
    const handleVideoInView = (inViewVideoId)=>{
        const currentUserId = id || loggedUserId;
        const newUrl = `/user/${currentUserId}/shot/${inViewVideoId}`;
        window.history.replaceState(null, '', newUrl);
    }



    const totalikes = (profileVideos).reduce((total,video)=>{
        return total + video.likeCount;
    },0)



    if (isFeedOpen) {
        return (
            <ShotFeed
                items={profileVideos}
                customSetVideos={setProfileVideos}
                emptyMessage="Video Not Available."
                targetId={shotId}
                onVideoInView={handleVideoInView}
            />
        )
    }

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">

                    <img className={`profile-image ${!profile?.profileImage ? 'invert-default-img' : ''}`} src={profile?.profileImage || "https://media.istockphoto.com/id/2177237919/vector/profile-icon-man-icon-silhouette.jpg?s=612x612&w=0&k=20&c=cJBk_nvOaN3CMfsykMk3QRhNabof0bS_9kShyqLVyZ8="} alt="" />

                    <div className="profile-info">
                        <h1 className="profile-name" title="Name">
                            {profile?.name}
                        </h1>
                        <p className='profile-about' title='About'>{profile?.about}</p>
                    </div>
                </div>

                <div className="profile-stats" aria-label="Stats">
                    <div className="profile-stat">
                        <span className="profile-stat-label">total videos</span>
                        <span className="profile-stat-value">{profileVideos?.length || 0}</span>
                    </div>



                    <div className="profile-stat">
                        <span className="profile-stat-label">total likes</span>
                        <span className="profile-stat-value">{totalikes}</span>
                    </div>
                </div>
                {isMyProfile && (
                    <button onClick={()=>{navigate("/edit/profile")}} className="edit-btn">Edit Profile</button>
                )}
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {profileVideos.map((v) => (
                    <div key={v._id} className="profile-grid-item" onClick={() => onOpenVideo(v._id)} >

                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={v.video} muted ></video>

                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile