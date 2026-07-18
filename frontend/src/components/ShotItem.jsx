import { useEffect, useRef, useState} from "react";
import { Link } from 'react-router-dom'
import CommentDrawer from "./CommentDrawer";
import { useVideoActions } from "../hooks/useVideoActions";


const ShotItem = ({ item,customSetVideos, isMuted, setIsMuted, loggedUserId, videoRefHandler }) => {
    const { likeVideo, saveVideo, shareVideo, deleteVideo } = useVideoActions(customSetVideos);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const commentBtnRef = useRef(null);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [popupCoords, setPopupCoords] = useState({ top: 0, right: 0 });

    const [isExpanded, setIsExpanded] = useState(false);

    const [showHeart, setShowHeart] = useState(false)
    const [showVolume, setShowVolume] = useState(false)

    // const [isPaused, setIsPaused] = useState(false)

    const clickTimer = useRef(null)


    const closeMoreMenu = () => {
        setIsMenuOpen(false);
        setTimeout(() => setShowConfirm(false), 200);
    };


    const handleVideoClick = (e) => {
        e.stopPropagation();
        const video = e.target;

        if (clickTimer.current) {
            clearTimeout(clickTimer.current)
            clickTimer.current = null
            if (likeVideo) {
                likeVideo(item)
            }
            setShowHeart(true);
            setTimeout(() => {
                setShowHeart(false);
            }, 1000);
        }
        else {
            clickTimer.current = setTimeout(() => {
                setIsMuted(!isMuted)
                setShowVolume(true);
                setTimeout(() => {
                    setShowVolume(false)
                }, 1000);

                clickTimer.current = null;
            }, 250);
        }
    }

    const handleOpenComment = () => {
        const rect = commentBtnRef.current.getBoundingClientRect();
        setPopupCoords({
            top: window.innerHeight - rect.bottom - 60,
            right: window.innerWidth - rect.left + 5
        })
        setIsCommentOpen(true)
    }

    return (
        <section className="shot" role="listitem">
            <video
                ref={videoRefHandler}
                id={item._id}
                className="shot-video"
                src={item.video}
                muted={isMuted}
                playsInline
                loop
                preload="metadata"
                onClick={handleVideoClick}
            />

            {showVolume && (
                <div className="tap-animation-overlay">
                    {isMuted ?
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="100" height="100">
                            <path d="M5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z"></path>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="100" height="100">
                            <path d="M2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.887 3.73857C11.7121 3.52485 11.3971 3.49335 11.1834 3.66821L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 10.0883 17.106 8.38548 15.7133 7.28673L14.2842 8.71584C15.3213 9.43855 16 10.64 16 12C16 13.36 15.3213 14.5614 14.2842 15.2841L15.7133 16.7132C17.106 15.6145 18 13.9116 18 12Z"></path>
                        </svg>
                    }
                </div>
            )}


            {showHeart && (
                <div className="tap-animation-overlay">
                    <svg viewBox="0 0 24 24" fill="red" width="100" height="100">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                </div>
            )}


            <div className="shot-overlay">
                <div className="shot-overlay-gradient" />
                <div className="shot-actions">

                    {/* like button */}
                    <div className="shot-action-group">
                        <button
                            onClick={() => likeVideo(item)}
                            className="shot-action"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill={item.isLiked ? "red" : "none"} stroke={item.isLiked ? "red" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                            </svg>
                        </button>
                        <div className="shot-action__count">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</div>
                    </div>


                    {/* comment button */}
                    <div className="shot-action-group">
                        <button className="shot-action" ref={commentBtnRef} onClick={() => { handleOpenComment() }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none" >
                            <path d="M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242ZM7.58075 18.711L8.23428 19.0605C9.38248 19.6745 10.6655 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 13.3345 4.32549 14.6175 4.93949 15.7657L5.28896 16.4192L4.63416 19.3658L7.58075 18.711Z"></path>
                            </svg>
                        </button>
                        <div className="shot-action__count">{item.commentCount ?? 0}</div>
                    </div>

                    {/* comment drawer */}
                    {isCommentOpen && (
                        <CommentDrawer
                            item={item}
                            setIsCommentOpen={setIsCommentOpen}
                            isCommentOpen={isCommentOpen}
                            popupCoords={popupCoords}
                        />
                    )}


                    {/* save Button */}
                    <div className="shot-action-group">
                        <button
                            className="shot-action"
                            onClick={() => saveVideo(item)}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill={item.isSaved ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                            </svg>
                        </button>
                        <div className="shot-action__count">{item.saveCount ?? item.savesCount ?? item.saves ?? 0}</div>
                    </div>


                    {/* Share Button */}
                    <div className="shot-action-group">
                        <button className="shot-action" onClick={() => shareVideo(item)}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                        </button>
                    </div>



                    {/* more button */}
                    {item.createdBy === loggedUserId && (
                        <div className="shot-action-group">
                            <button className="shot-action" onClick={() => { setIsMenuOpen(true) }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path></svg>
                            </button>

                        </div>
                    )}

                    {/* Pop-up Menu */}
                    {isMenuOpen && (
                        <div className="more-popup-overlay" onClick={closeMoreMenu}>
                            <div className="more-popup-box" onClick={(e) => e.stopPropagation()}>

                                {!showConfirm ? (
                                    // --- NORMAL MENU ---
                                    <>
                                        <button className="popup-item delete-text" onClick={() => setShowConfirm(true)}>
                                            Delete
                                        </button>

                                        <div className="popup-divider"></div>

                                        <button className="popup-item" onClick={closeMoreMenu}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    // --- CONFIRMATION MENU ---
                                    <>
                                        <div className="popup-header">
                                            <span className="popup-title">Delete Shot?</span>
                                            <span className="popup-subtitle">Are you sure you want to delete this video?</span>
                                        </div>

                                        <div className="popup-divider"></div>

                                        <button className="popup-item delete-text" onClick={() => {
                                            deleteVideo?.(item);
                                            closeMoreMenu();
                                        }}>
                                            Yes, Delete
                                        </button>

                                        <div className="popup-divider"></div>

                                        <button className="popup-item" onClick={closeMoreMenu}>
                                            Cancel
                                        </button>
                                    </>
                                )}

                            </div>
                        </div>
                    )}

                </div>

                <div className="shot-content">
                    <p onClick={() => setIsExpanded(!isExpanded)} className={`shot-description ${isExpanded ? 'expanded-text' : 'collapsed-text'}`} title={item.description}>
                        {item.description}
                    </p>

                    {item.createdBy && item.createdBy._id && (
                        <Link className="shot-owner-profile-link"
                            to={`/user/${item.createdBy._id}`}
                            aria-label="Go to owner profile" >
                            <img
                                className="shot-owner-avatar"
                                src={item.createdBy.profileImage || "https://media.istockphoto.com/id/2177237919/vector/profile-icon-man-icon-silhouette.jpg?s=612x612&w=0&k=20&c=cJBk_nvOaN3CMfsykMk3QRhNabof0bS_9kShyqLVyZ8="}
                                alt={item.createdBy.name}
                            />
                            <span className="shot-owner-name">{item.createdBy.name}</span>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ShotItem