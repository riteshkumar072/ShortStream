import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import '../styles/create-post.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { UploadContext } from '../context/UploadContext';

const CreatePost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoURL, setVideoURL] = useState('');
    const [fileError, setFileError] = useState(location.state?.selectedFileError || '');
    const [videoFile, setVideoFile] = useState(location.state?.selectedFile || null);
    const fileInputRef = useRef(null);

    const { uploadVideo } = useContext(UploadContext)

    useEffect(() => {
        if (!videoFile) {
            setVideoURL('');
            navigate('/', { replace: true });
            return;
        }
        const url = URL.createObjectURL(videoFile);
        setVideoURL(url);
        return () => URL.revokeObjectURL(url);
    }, [videoFile]);


    const onFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) { setVideoFile(null); setFileError(''); return; }
        if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
        const MAX_SIZE_20MB = 20 * 1024 * 1024;
        if (file.size > MAX_SIZE_20MB) {
            setFileError("Please upload video less than 20 MB")
        } else {
            setFileError('');
        }

        setVideoFile(file);
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('description', description);
        formData.append("video", videoFile);

        uploadVideo(formData)

        navigate("/");
    };

    const isLimitExceeded = true;
    const isDisabled = !videoFile || Boolean(fileError) || isLimitExceeded;

    return (
        <div className="create-shot-page">
            <div className="create-shot-card">
                <header className="create-shot-header">
                    <h1 className="create-shot-title">Create Shot</h1>
                </header>
                <form className="create-shot-form" onSubmit={onSubmit}>
                    <div className="field-group">
                        <label htmlFor="shotVideo">Video</label>
                        {fileError && <p className="error-text" role="alert">{fileError}</p>}
                        <input
                            id="shotVideo"
                            type="file"
                            ref={fileInputRef}
                            onChange={onFileChange}
                            accept="video/*"
                            style={{ display: 'none' }}
                        />
                        {videoFile && videoURL && (
                            <div className="uploaded-video-section">
                                <div className="file-chip" aria-live="polite">
                                    <span className="file-chip-size">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                                    <button type="button" className="btn-change" onClick={openFileDialog}>Change</button>
                                </div>
                                <div className="video-preview">
                                    <video className="video-preview-el" src={videoURL} controls playsInline preload="metadata" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="field-group">
                        <label htmlFor="shotDesc">Description</label>
                        <textarea
                            id="shotDesc"
                            rows={4}
                            placeholder="Write a short description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-actions" style={{display: "flex" , flexDirection:'column'}}>
                        {isLimitExceeded && (
                            <span className="error-message-text" style={{ color: '#ff4d4f', display: 'block', marginBottom: '8px' }}>
                                "Video uploads are temporarily disabled. Please try again later."
                            </span>
                        )}
                        <button className="btn-primary" type="submit" disabled={isDisabled}>
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;