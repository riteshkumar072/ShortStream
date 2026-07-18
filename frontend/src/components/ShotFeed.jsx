import React, { useEffect, useRef, useContext, useState, useLayoutEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import ShotItem from './ShotItem'

const ShotFeed = ({ items = [],customSetVideos, emptyMessage = 'No videos yet.', targetId, onVideoInView }) => {
  const videoRefs = useRef(new Map())
  const hasScrolledRef = useRef(false);
  const { loggedUserId } = useContext(AuthContext)

  const [isMuted, setIsMuted] = useState(true)


  useLayoutEffect(() => {
    if (items.length > 0 && !hasScrolledRef.current) {
      const container = document.querySelector('.shots-container')
      if (container) {
        const targetElement = targetId ? document.getElementById(targetId) : null;
        if (targetElement) {
          const targetSection = targetElement.closest('.shot')
          if (targetSection) {
            container.scrollTo({ top: targetSection.offsetTop, behavior: "instant" })
          }
          hasScrolledRef.current = true;
        }
      }

    }
  }, [items, targetId])

  useEffect(() => {
    let scrollTimeout;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {

          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {

            if (scrollTimeout) clearTimeout(scrollTimeout)

            scrollTimeout = setTimeout(() => {
              if (onVideoInView) {
                onVideoInView(video.id)
              }
            }, 300);


            video.play().catch(() => { /* ignore autoplay errors */ })
          } else {
            video.pause()
            video.currentTime = 0;
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items, onVideoInView])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }


  return (
    <div className="shots-page">
      <div className='shots-container' role="list">
        {items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => (

          <ShotItem
            key={item._id}
            item={item}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            loggedUserId={loggedUserId}
            videoRefHandler={setVideoRef(item._id)}
            customSetVideos={customSetVideos}
          />
        ))}
      </div>
    </div>
  )
}

export default ShotFeed