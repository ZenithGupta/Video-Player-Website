import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar, Form } from 'react-bootstrap';

// Define content for this component
const content = {
    en: {
        welcomeBack: "Welcome back! Continue your recovery journey.",
        yourProgress: "Your Progress",
        weeks: "weeks",
        days: "days",
        left: "left",
        accessExpires: "Your access expires in",
        selectPhase: "Select Your Phase",
        goToPhase: "Go to Phase",
        aboutCourse: "About This Course",
        description: "Detailed course description will go here."
    },
    ta: {
        welcomeBack: "மீண்டும் வருக! உங்கள் மீட்பு பயணத்தைத் தொடரவும்.",
        yourProgress: "உங்கள் முன்னேற்றம்",
        weeks: "வாரங்கள்",
        days: "நாட்கள்",
        left: "மீதமுள்ளன",
        accessExpires: "உங்கள் அணுகல் காலாவதியாகிறது",
        selectPhase: "உங்கள் கட்டத்தைத் தேர்ந்தெடுக்கவும்",
        goToPhase: "கட்டத்திற்குச் செல்லவும்",
        aboutCourse: "இந்த பாடநெறி பற்றி",
        description: "விரிவான பாடநெறி விளக்கம் இங்கே செல்லும்."
    }
};

const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const videoUrl = new URL(url);
        return `https://player.vimeo.com/video/${videoUrl.pathname.split('/')[1]}?title=0&byline=0&portrait=0&dnt=1`;
    } catch (e) { return ""; }
};

const CourseHomePage = ({ course, userCourse, language }) => {
    const [selectedPhase, setSelectedPhase] = useState('');
    const navigate = useNavigate();
    const t = content[language]; // Translation object

    useEffect(() => {
        if (userCourse?.current_phase) {
            setSelectedPhase(userCourse.current_phase);
        } else if (course.phases?.length > 0) {
            setSelectedPhase(course.phases[0].id);
        }
    }, [course, userCourse]);

    const introVideo = course.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0];

    const calculateTimeLeft = () => {
        if (!userCourse?.end_time) return { weeks: 0, days: 0 };
        const endDate = new Date(userCourse.end_time);
        const now = new Date();
        const diffTime = endDate - now;
        if (diffTime <= 0) return { weeks: 0, days: 0 };
        
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;
        return { weeks, days };
    };

    const handleGoToCourse = () => {
        if (selectedPhase) {
            navigate(`/player/${course.id}/phase/${selectedPhase}`);
        } else {
            alert("Please select a phase to begin.");
        }
    };

    const timeLeft = calculateTimeLeft();
    const validity_weeks = course.validity_weeks || 5;
    const totalDays = validity_weeks * 7;
    const daysLeft = timeLeft.weeks * 7 + timeLeft.days;
    const progress = Math.min(((totalDays - daysLeft) / totalDays) * 100, 100);

    return (
        <div className="main-content">
            <header className="course-header-dark py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={8} className="text-white">
                            <h1>{course.title}</h1>
                            <p className="lead">{t.welcomeBack}</p>
                            <div className="mt-4">
                               <h5>{t.yourProgress}</h5>
                               <ProgressBar now={progress} label={`${timeLeft.weeks} ${t.weeks} and ${timeLeft.days} ${t.days} ${t.left}`} className="mb-2" />
                               <small>{t.accessExpires} {timeLeft.weeks} {t.weeks} and {timeLeft.days} {t.days}.</small>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <Card className="course-action-card">
                                {introVideo && (
                                    <div className="player-wrapper"><iframe className="video-iframe" src={getEmbedUrl(introVideo.vimeo_url)} frameBorder="0" allow="fullscreen" title={`Intro to ${course.title}`}></iframe></div>
                                )}
                                <Card.Body>
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t.selectPhase}</Form.Label>
                                        <Form.Select value={selectedPhase} onChange={e => setSelectedPhase(e.target.value)}>
                                            {course.phases && course.phases.map(phase => (
                                                <option key={phase.id} value={phase.id}>{phase.title}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Button variant="dark" size="lg" className="w-100" onClick={handleGoToCourse}>
                                        {t.goToPhase}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </header>
            <Container className="py-5">
                <h2>{t.aboutCourse}</h2>
                <p>{t.description}</p>
            </Container>
        </div>
    );
};

export default CourseHomePage;