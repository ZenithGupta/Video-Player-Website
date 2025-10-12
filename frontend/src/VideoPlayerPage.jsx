import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Alert, Tabs, Tab, ListGroup, Card } from 'react-bootstrap';
import API_URL from './config/api.js';

const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const videoUrl = new URL(url);
        const pathParts = videoUrl.pathname.split('/').filter(Boolean);
        const videoId = pathParts[0];
        const privacyHash = pathParts[1];
        const privacyParam = privacyHash ? `h=${privacyHash}&` : '';
        return `https://player.vimeo.com/video/${videoId}?${privacyParam}autoplay=1&color=ffffff&title=0&byline=0&portrait=0&dnt=1`;
    } catch (e) { return ""; }
};

export default function VideoPlayerPage({ language }) {
    const [course, setCourse] = useState(null);
    const [activeVideo, setActiveVideo] = useState({ video: null, weekIndex: 0, dayIndex: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { courseId, phaseId } = useParams();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                // Add the lang query parameter to the API call
                const response = await axios.get(`${API_URL}/courses/${courseId}/?lang=${language}`);
                const courseData = response.data;
                
                const selectedPhase = courseData.phases.find(p => p.id === parseInt(phaseId));
                
                if (selectedPhase) {
                    setCourse({ ...courseData, phases: [selectedPhase] });
                    const firstVideo = selectedPhase.weeks?.[0]?.playlist?.videos?.[0];
                    if (firstVideo) {
                        setActiveVideo({ video: firstVideo, weekIndex: 0, dayIndex: 0 });
                    }
                } else {
                    setError('Selected phase not found in this course.');
                }
            } catch (err) {
                setError('Failed to load course content.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId, phaseId, language]); // Add language to the dependency array

    const generateVideoTitle = () => {
        if (!activeVideo.video) return course?.title || '';
        const { video, dayIndex } = activeVideo;
        return `Day ${dayIndex + 1}: ${video.title}`;
    };

    const embedUrl = getEmbedUrl(activeVideo.video?.vimeo_url);

    if (loading) return <Container className="main-content py-5 text-center"><h2>Loading...</h2></Container>;
    if (error) return <Container className="main-content py-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!course) return null;

    const currentPhase = course.phases?.[0];

    return (
        <div className="main-content">
            <div className="player-section-dark">
                <div className="player-container">
                    <div className="d-flex justify-content-between align-items-center mb-2 player-header">
                       <h4 className="video-title-light">{generateVideoTitle()}</h4>
                       <Link to={`/course/${course.id}`} className="btn-close btn-close-white" aria-label="Close"></Link>
                    </div>
                    {embedUrl ? (
                        <div className='player-wrapper'>
                            <iframe className='video-iframe' src={embedUrl} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" title={activeVideo.video?.title} key={activeVideo.video?.vimeo_url}></iframe>
                        </div>
                    ) : (
                         <div className="player-wrapper d-flex align-items-center justify-content-center bg-dark text-white"><Alert variant="dark">Select a video to begin.</Alert></div>
                    )}
                </div>
            </div>
            <div className="course-content-container py-4">
                <h1 className="main-heading mb-2">{course.title}</h1>
                <p className="lead text-muted">{currentPhase?.title}</p>
                <hr />
                {currentPhase ? (
                    <Tabs defaultActiveKey={`week-0`} id="week-tabs" className="mb-3">
                        {currentPhase.weeks.map((week, weekIndex) => (
                            <Tab eventKey={`week-${weekIndex}`} title={week.title} key={week.id}>
                                <Card>
                                    <Card.Header>Daily Videos for {week.title}</Card.Header>
                                    <ListGroup variant="flush">
                                        {week.playlist?.videos.map((video, dayIndex) => (
                                            <ListGroup.Item key={`${video.id}-${dayIndex}`} action onClick={() => setActiveVideo({ video, weekIndex, dayIndex })} active={activeVideo.video === video}>
                                                <strong>Day {dayIndex + 1}:</strong> {video.title}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card>
                            </Tab>
                        ))}
                    </Tabs>
                ) : <Alert variant="info">No content available for this phase.</Alert>}
            </div>
        </div>
    );
}