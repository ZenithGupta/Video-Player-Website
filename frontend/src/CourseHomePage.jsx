import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar, Form } from 'react-bootstrap';

const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const videoUrl = new URL(url);
        return `https://player.vimeo.com/video/${videoUrl.pathname.split('/')[1]}?title=0&byline=0&portrait=0&dnt=1`;
    } catch (e) { return ""; }
};

const CourseHomePage = ({ course, userCourse }) => {
    const [selectedPhase, setSelectedPhase] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Set the user's current phase from their enrollment data, or default to the first phase
        if (userCourse?.current_phase) {
            setSelectedPhase(userCourse.current_phase);
        } else if (course.phases?.length > 0) {
            setSelectedPhase(course.phases[0].id);
        }
    }, [course, userCourse]);

    const introVideo = course.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0];

    const calculateDaysLeft = () => {
        if (!userCourse?.end_time) return 0;
        const endDate = new Date(userCourse.end_time);
        const now = new Date();
        const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleGoToCourse = () => {
        if (selectedPhase) {
            // Navigate to the player with both course and phase IDs
            navigate(`/player/${course.id}/phase/${selectedPhase}`);
        } else {
            alert("Please select a phase to begin.");
        }
    };

    const daysLeft = calculateDaysLeft();
    const validity_days = course.validity_days || 35;
    const progress = Math.min(((validity_days - daysLeft) / validity_days) * 100, 100);

    return (
        <div className="main-content">
            <header className="course-header-dark py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={8} className="text-white">
                            <h1>{course.title}</h1>
                            <p className="lead">Welcome back! Continue your recovery journey.</p>
                            <div className="mt-4">
                               <h5>Your Progress</h5>
                               <ProgressBar now={progress} label={`${daysLeft} days left`} className="mb-2" />
                               <small>Your access expires in {daysLeft} days.</small>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <Card className="course-action-card">
                                {introVideo && (
                                    <div className="player-wrapper"><iframe className="video-iframe" src={getEmbedUrl(introVideo.vimeo_url)} frameBorder="0" allow="fullscreen" title={`Intro to ${course.title}`}></iframe></div>
                                )}
                                <Card.Body>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Select Your Phase</Form.Label>
                                        <Form.Select value={selectedPhase} onChange={e => setSelectedPhase(e.target.value)}>
                                            {course.phases.map(phase => (
                                                <option key={phase.id} value={phase.id}>{phase.title}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Button variant="dark" size="lg" className="w-100" onClick={handleGoToCourse}>
                                        Go to Phase
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </header>
            <Container className="py-5">
                <h2>About This Course</h2>
                <p>Detailed course description will go here.</p>
            </Container>
        </div>
    );
};

export default CourseHomePage;

