// frontend/src/VideoPlayerPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Alert, Button, CloseButton } from 'react-bootstrap';

const API_URL = 'http://127.0.0.1:8000/api';

const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const videoUrl = new URL(url);
        const pathParts = videoUrl.pathname.split('/').filter(Boolean);
        if (pathParts.length === 0) return '';
        const videoId = pathParts[0];
        const privacyHash = pathParts[1];
        if (privacyHash) {
            return `https://player.vimeo.com/video/${videoId}?h=${privacyHash}&autoplay=1`;
        }
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    } catch (e) {
        console.error("Invalid Vimeo URL:", url, e);
        return "";
    }
};

export default function VideoPlayerPage() {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { courseId } = useParams(); // Gets the ':courseId' from the URL

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/courses/${courseId}/`);
                setCourse(response.data);
                setError('');
            } catch (err) {
                setError('Failed to load the course. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) {
        return <Container className="py-5 text-center"><h2>Loading course...</h2></Container>;
    }

    if (error) {
        return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (!course) {
        return null;
    }

    const videoToPlay = course.playlists?.[0]?.videos?.[0];
    const embedUrl = getEmbedUrl(videoToPlay?.vimeo_url);

    return (
        <Container fluid="xl" className="py-4">
             <div className="video-player-section">
                <div className="video-player-header">
                    <h5 className="video-player-title">{videoToPlay?.title || course.title}</h5>
                    {/* Link back to the homepage */}
                    <Link to="/" className="btn-close" aria-label="Close"></Link>
                </div>
                {embedUrl ? (
                    <div className='player-wrapper'>
                        <iframe
                            className='video-iframe'
                            src={embedUrl}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                            title={videoToPlay.title}>
                        </iframe>
                    </div>
                ) : (
                    <Alert variant="warning">No video available for this course.</Alert>
                )}
            </div>
        </Container>
    );
}