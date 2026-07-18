import React, { useState, useEffect, useRef } from 'react';
import '../styles/comment-drawer.css'
import { createPortal } from 'react-dom';
import { useVideoActions } from '../hooks/useVideoActions';
import { formatDistanceToNowStrict } from 'date-fns';

const CommentDrawer = ({ setIsCommentOpen, isCommentOpen, popupCoords, item }) => {
    const drawerRef = useRef(null)
    const sizeCheckforpopupcomment = window.innerWidth >= 600 && window.innerWidth <= 1300;

    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const { getComment, createComment } = useVideoActions()


    //close comment box on outside click
    useEffect(() => {
        const handleOutsideAction = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setIsCommentOpen(false)
            }
        }
        if (isCommentOpen) {
            document.addEventListener("mousedown", handleOutsideAction)
            window.addEventListener("scroll", handleOutsideAction, true)
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideAction)
            window.removeEventListener("scroll", handleOutsideAction, true);
        };
    }, [isCommentOpen])



    //comment fetching
    useEffect(() => {
        const fetchAndsetComments = async () => {
            const data = await getComment(item._id);
            setComments(data);
        }
        fetchAndsetComments();
    }, [item._id])


    //post comment
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!commentText.trim()) return;

        const newComment = await createComment(item._id, commentText)
        if (newComment) {
            setComments((prevComments) => [newComment, ...prevComments])
            setCommentText("");
        }
    }



    return createPortal(
        <div className="comment-drawer">

            <div className="drawer-overlay" onClick={() => setIsCommentOpen(false)}></div>

            <div className="drawer-content-box" ref={drawerRef}
                style={sizeCheckforpopupcomment ? {
                    position: 'absolute',
                    top: `${popupCoords.top}px`,
                    right: `${popupCoords.right}px`
                }
                    : {}
                }>

                <div className="drawer-drag-handle"></div>

                <div className="drawer-header">
                    <h3 className="drawer-title">Comments <span className="comment-count">{item.commentCount ?? 0}</span></h3>
                    <button className="drawer-close-btn" onClick={() => setIsCommentOpen(false)} aria-label="Close comments">&times;</button>
                </div>

                <div className="drawer-divider"></div>


                {/* all comments */}
                <div className="drawer-body">
                    {comments.map(c => (
                        <div key={c._id} className="comment-item">
                            <img className="comment-avatar" src={c.commentBy.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.commentBy.name)}&background=random`} alt={c.commentBy.name} />
                            <div className="comment-details">
                                <div className="comment-user-info">
                                    <span className="comment-username">{c.commentBy.name}</span>
                                    <span className="comment-time">{formatDistanceToNowStrict(new Date(c.createdAt), { addSuffix: false })}</span>
                                </div>
                                <p className="comment-text">{c.text} </p>
                            </div>
                        </div>
                    ))}

                </div>

                <div className="drawer-divider"></div>

                <form className="drawer-footer" onSubmit={handleSubmit}>
                    <div className="comment-input-wrapper">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="comment-input"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button disabled={!commentText.trim()} type="submit" className="comment-submit-btn">Post</button>
                    </div>
                </form>

            </div>
        </div>,
        document.body
    );
};

export default CommentDrawer;