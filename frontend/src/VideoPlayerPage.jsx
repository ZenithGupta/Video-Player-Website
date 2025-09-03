import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Alert, Tabs, Tab, ListGroup, Row, Col, Card } from 'react-bootstrap';

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
            return `https://player.vimeo.com/video/${videoId}?h=${privacyHash}&autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
        }
        return `https://player.vimeo.com/video/${videoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
    } catch (e) {
        console.error("Invalid Vimeo URL:", url, e);
        return "";
    }
};

export default function VideoPlayerPage() {
    const [course, setCourse] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [activeDay, setActiveDay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { courseId } = useParams();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/courses/${courseId}/`);
                const courseData = response.data;
                setCourse(courseData);

                // Logic to find the first video of the first day of the first week of the first phase
                const firstPhase = courseData.phases?.[0];
                const firstWeek = firstPhase?.weeks?.[0];
                const firstDay = firstWeek?.days?.[0];
                const firstVideo = firstDay?.videos?.[0];

                if (firstDay) setActiveDay(firstDay);
                if (firstVideo) setCurrentVideo(firstVideo);
                
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

    const embedUrl = getEmbedUrl(currentVideo?.vimeo_url);

    if (loading) {
        return <Container className="py-5 text-center"><h2>Loading course...</h2></Container>;
    }

    if (error) {
        return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (!course) {
        return <Container className="py-5"><Alert variant="info">No course data found.</Alert></Container>;
    }

    // For now, we only show the first phase based on the new logic
    const currentPhase = course.phases?.[0];

    return (
        <div className="video-page-wrapper">
            {/* Section 1: Full-width video player */}
            <div className="player-section-dark">
                <div className="player-container">
                    <div className="d-flex justify-content-between align-items-center mb-2 player-header">
                       <h4 className="video-title-light">{currentVideo?.title || course.title}</h4>
                       <Link to="/" className="btn-close btn-close-white" aria-label="Close"></Link>
                    </div>
                    {embedUrl ? (
                        <div className='player-wrapper'>
                            <iframe
                                className='video-iframe'
                                src={embedUrl}
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                                title={currentVideo?.title}>
                            </iframe>
                        </div>
                    ) : (
                         <div className="player-wrapper d-flex align-items-center justify-content-center bg-dark text-white">
                            <Alert variant="dark">Select a video to play.</Alert>
                        </div>
                    )}
                </div>
            </div>

            {/* Section 2: Course content and playlist */}
            <div className="course-content-container py-4">
                <h1 className="main-heading mb-2">{course.title}</h1>
                <p className="lead text-muted">{currentPhase?.title}</p>
                <hr />

                {currentPhase ? (
                    <Tabs defaultActiveKey={`week-0`} id="week-tabs" className="mb-3">
                        {currentPhase.weeks.map((week, index) => (
                            <Tab eventKey={`week-${index}`} title={week.title} key={week.id}>
                                <h4 className="mt-4">Daily Schedule</h4>
                                <ListGroup horizontal className="mb-3 day-list-group">
                                    {week.days.map(day => (
                                        <ListGroup.Item 
                                            key={day.id}
                                            action
                                            active={activeDay?.id === day.id}
                                            onClick={() => setActiveDay(day)}
                                        >
                                            {day.title}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>

                                {activeDay && (
                                    <Card>
                                        <Card.Header>
                                            Videos for <strong>{activeDay.title}</strong>
                                        </Card.Header>
                                        <ListGroup variant="flush">
                                            {activeDay.is_rest_day ? (
                                                <ListGroup.Item>Today is a rest day. Well done!</ListGroup.Item>
                                            ) : activeDay.videos.length > 0 ? (
                                                activeDay.videos.map(video => (
                                                    <ListGroup.Item 
                                                        key={video.id} 
                                                        action 
                                                        onClick={() => setCurrentVideo(video)}
                                                        active={currentVideo?.id === video.id}
                                                    >
                                                        ▶️ {video.title}
                                                    </ListGroup.Item>
                                                ))
                                            ) : (
                                                <ListGroup.Item>No videos scheduled for today.</ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </Card>
                                )}
                            </Tab>
                        ))}
                    </Tabs>
                ) : (
                    <Alert variant="info">No phases or content available for this course yet.</Alert>
                )}
            </div>
        </div>
    );
}