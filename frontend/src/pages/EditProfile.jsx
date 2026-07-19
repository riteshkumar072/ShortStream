import React, { useState, useRef, useContext, useEffect } from 'react'
import '../styles/edit-profile.css'
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import toast from 'react-hot-toast';

const EditProfile = () => {
    const { loggedUserProfileIMG, loggedUserName, loggedUserAbout } = useContext(AuthContext)
    const navigate = useNavigate();

    const [name, setName] = useState(loggedUserName || '');
    const [about, setAbout] = useState(loggedUserAbout || '');
    const [profileImage, setProfileImage] = useState(loggedUserProfileIMG || '');
    const [previewImage, setPreviewImage] = useState(null);


    const NAME_LIMIT = 30;
    const ABOUT_LIMIT = 150;
    const isNameOverLimit = name.length > NAME_LIMIT;
    const isAboutOverLimit = about.length > ABOUT_LIMIT;
    const isUnchanged = name === loggedUserName && about === (loggedUserAbout || "") && previewImage === null;

    const isButtonDisabled = name.trim().length === 0 || isNameOverLimit || isAboutOverLimit || isUnchanged


    const fileInputRef = useRef(null);

    

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }
    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0]
        if (file) {
            setProfileImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
        else {
            console.log("something wrong")
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        if (name) formData.append('name', name)
        if (about) formData.append('about', about);
        if (profileImage) formData.append('profileImage', profileImage);

        try {
            apiClient.put('/user/edit-profile', formData)
                .then(response => {
                    navigate(-1)
                    toast.success(response.data.message)
                })
        } catch (error) {
            console.error('Update failed:', error);
        }
    }

    return (
        <div className="edit-profile-container">
            <header className="edit-profile-header">
                <h1 className="edit-profile-title">Edit Profile</h1>
            </header>

            <form className="edit-profile-form" onSubmit={handleSubmit}>

                {/* --- Profile Image Section --- */}
                <div className="form-group image-change-group">
                    <label className="form-label">Profile Picture</label>

                    <div className="image-preview-wrapper" onClick={openFileDialog}>
                        <img src={previewImage || loggedUserProfileIMG || "https://media.istockphoto.com/id/2177237919/vector/profile-icon-man-icon-silhouette.jpg?s=612x612&w=0&k=20&c=cJBk_nvOaN3CMfsykMk3QRhNabof0bS_9kShyqLVyZ8="} alt="Profile Preview" className={`profile-preview-img ${(!previewImage && !loggedUserProfileIMG) ? 'invert-default-img' : ''}`} />
                    </div>

                    {/* Hidden input */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden-file-input"
                        style={{ display: 'none' }}
                    />

                    <button type="button" onClick={openFileDialog} className="change-image-btn">
                        Change Photo
                    </button>
                </div>


                <div className="form-group">
                    <label htmlFor="editName" className="form-label">Name</label>
                    <input
                        type="text"
                        id="editName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Your name"
                        className={`form-input ${isNameOverLimit ? 'error-border' : ''}`}
                    />
                    <div className={`counter-text ${isNameOverLimit ? 'error-text' : ''}`}>
                        {name.length} / {NAME_LIMIT}
                    </div>
                </div>


                <div className="form-group">
                    <label htmlFor="editBio" className="form-label">Bio / about</label>
                    <textarea
                        id="editBio"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Write something about yourself..."
                        rows={4}
                        className={`form-input textarea-input ${isAboutOverLimit ? 'error-border' : ''}`}
                    />
                    <div className={`counter-text ${isAboutOverLimit ? 'error-text' : ''}`}>
                        {about.length} / {ABOUT_LIMIT}
                    </div>
                </div>


                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => { navigate(-1); }}>
                        Cancel
                    </button>
                    <button disabled={isButtonDisabled} type="submit" className="save-btn">
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
    )
}

export default EditProfile