import React, { useState, useRef, useEffect } from 'react';
import { Container, Navbar, Nav, Form, Button, Card, CloseButton, Row, Col, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import VideoPlayerPage from './VideoPlayerPage.jsx';
import CoursePage from './CoursePage.jsx';
import MyCoursesPage from './MyCoursesPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import API_URL from './config/api.js';

// This imports the styles from your main CSS file.
import './index.css';

// --- API Base URL ---
// const API_URL = 'http://127.0.0.1:8000/api';

// --- Language Content ---
const content = {
    en: {
        brand: "PhysioFlex",
        myCourses: "My Courses",
        searchPlaceholder: "Search for anything",
        forBusiness: "For Business",
        teach: "Teach",
        login: "Log In",
        signup: "Sign Up",
        logout: "Log Out",
        welcome: "Welcome",
        mainHeading: "The One Last Move Program: Move Without Pain",
        intro: "In our daily lives, simple activities like sitting on the floor, using Indian-style toilets, climbing stairs, bending down and getting up, walking long distances, or standing for long periods become difficult for many people. Through our THE ONE LAST MOVE training program, you can perform all these everyday actions effortlessly and pain-free.",
        subHeading: "This program is designed to help you overcome problems such as osteoarthritis, muscle tightness, muscle weakness, and spinal instability, allowing you to do what you love again—without limitations.",
        suffering: "Are you suffering from joint degeneration or osteoarthritis? You're not alone—and surgery is not the only solution.",
        journey: "This program helps restore your movement, kickstart a healthier, happier old age, and regain your confidence in life. I am happy to be part of your joyful journey. How can the One Last Move program help you overcome joint issues and move with ease in daily life?",
        principle1Title: "1. Understanding the Root Cause",
        principle1Text: "The primary reason you still experience pain is the lack of a proper understanding of what’s actuallycausing it. This program helps you get to the root of your problem and teaches you how to resolve it with the right movements and awareness.",
        principle2Title: "2. What Truly Deserves Attention?",
        principle2Text: "Will you continue to focus only on your X-rays and MRI reports? Or will you focus on the real cause of your joint and hip pain? If you can fix the other underlying issues—not just the degeneration—you can regain pain-free movements.",
        principle3Title: "3. Dedication is Key",
        principle3Text: "With the right understanding and the correct plan in hand, staying dedicated to your recovery becomes easier. Let go of fear, past failed attempts, and limiting beliefs. Start rebuilding your joints to a pain-free, empowered life.",
        howItWorksTitle: "How Does the Program Work?",
        howItWorksStep1: "Sign up for the 12-day free trial by submitting your details.",
        howItWorksStep2: "Answer a few questions to help us understand your pain levels and limitations.",
        howItWorksStep3: "Get customized exercises tailored to your condition.",
        howItWorksStep4: "After 12 days, continue your journey with a membership.",
        reclaimLifeTitle: "Reclaim Your Life",
        reclaimLifeText: "Our members are now performing movements they once thought impossible. This program helps reduce pain, improve strength, enhance balance, and boost confidence in your body's ability.",
        ctaTitle: "Don’t Wait Any Longer",
        ctaText: "Get started with your free 12-day trial worth ₹1000 today.",
        ctaButton: "Start Your 12-Day Free Trial Now",
        explore: "Explore",
        courseSectionTitle: "A broad selection of courses",
        assessmentTitle: "Pain Assessment Questions",
        assessmentIntro: "Once you begin, answer the following questions honestly to help us guide you on the right path:",
    },
    ta: {
        brand: "பிசியோஃபிளெக்ஸ்",
        myCourses: "எனது படிப்புகள்",
        searchPlaceholder: "எதையும் தேடுங்கள்",
        forBusiness: "வணிகத்திற்காக",
        teach: "கற்பிக்க",
        login: "உள்நுழை",
        signup: "பதிவு செய்க",
        logout: "வெளியேறு",
        welcome: "வருக",
        mainHeading: "தி ஒன் லாஸ்ட் மூவ் புரோகிராம்: வலியின்றி நகரவும்",
        intro: "நமது அன்றாட வாழ்வில், தரையில் அமர்வது, இந்திய கழிப்பறைகளைப் பயன்படுத்துவது, மாடிப்படிகளில் ஏறுவது, குனிந்து எழுவது, நீண்ட தூரம் நடப்பது, அல்லது நீண்ட நேரம் நிற்பது போன்ற எளிய நடவடிக்கைகள் பலருக்கு கடினமாகிவிடுகின்றன. எங்களின் 'தி ஒன் லாஸ்ட் மூவ்' பயிற்சித் திட்டத்தின் மூலம், இந்த அனைத்து அன்றாட செயல்களையும் நீங்கள் எளிதாகவும் வலியின்றியும் செய்ய முடியும்.",
        subHeading: "இந்தத் திட்டம் ஆஸ்டியோஆர்த்ரைடிஸ், தசை இறுக்கம், தசை பலவீனம் மற்றும் முதுகெலும்பு உறுதியற்றன்மை போன்ற பிரச்சனைகளைச் சமாளிக்க உதவும் வகையில் வடிவமைக்கப்பட்டுள்ளது, இது நீங்கள் விரும்பியதை மீண்டும் வரம்புகள் இல்லாமல் செய்ய அனுமதிக்கிறது.",
        suffering: "நீங்கள் மூட்டு தேய்மானம் அல்லது கீல்வாதத்தால் பாதிக்கப்படுகிறீர்களா? நீங்கள் தனியாக இல்லை - அறுவை சிகிச்சை மட்டுமே தீர்வு அல்ல.",
        journey: "இந்தத் திட்டம் உங்கள் இயக்கத்தை மீட்டெடுக்கவும், ஆரோக்கியமான, மகிழ்ச்சியான முதுமையைத் தொடங்கவும், வாழ்க்கையில் உங்கள் நம்பிக்கையை மீண்டும் பெறவும் உதவுகிறது. உங்கள் மகிழ்ச்சியான பயணத்தின் ஒரு பகுதியாக இருப்பதில் நான் மகிழ்ச்சியடைகிறேன். மூட்டுப் பிரச்சனைகளைச் சமாளித்து, அன்றாட வாழ்வில் எளிதாக நடமாட, 'தி ஒன் லாஸ்ட் மூவ்' திட்டம் உங்களுக்கு எப்படி உதவும்?",
        principle1Title: "1. மூல காரணத்தைப் புரிந்துகொள்வது",
        principle1Text: "நீங்கள் இன்னும் வலியை அனுபவிப்பதற்கு முக்கிய காரணம், உண்மையான காரணம் என்ன என்பதைப் பற்றிய சரியான புரிதல் இல்லாததுதான். இந்தத் திட்டம் உங்கள் பிரச்சனையின் மூல காரணத்தைக் கண்டறிந்து, சரியான இயக்கங்கள் மற்றும் விழிப்புணர்வுடன் அதை எவ்வாறு தீர்ப்பது என்று உங்களுக்குக் கற்பிக்கிறது.",
        principle2Title: "2. உண்மையிலேயே கவனம் செலுத்த வேண்டியது என்ன?",
        principle2Text: "உங்கள் எக்ஸ்-ரே மற்றும் எம்ஆர்ஐ அறிக்கைகளில் மட்டுமே கவனம் செலுத்துவீர்களா? அல்லது உங்கள் மூட்டு மற்றும் இடுப்பு வலியின் உண்மையான காரணத்தில் கவனம் செலுத்துவீர்களா? தேய்மானத்தை மட்டுமல்ல, மற்ற அடிப்படைப் பிரச்சனைகளையும் சரிசெய்தால், வலியற்ற இயக்கங்களை மீண்டும் பெறலாம்.",
        principle3Title: "3. அர்ப்பணிப்பு முக்கியம்",
        principle3Text: "சரியான புரிதலுடனும், சரியான திட்டத்துடனும், உங்கள் மீட்புக்கு அர்ப்பணிப்புடன் இருப்பது எளிதாகிறது. பயம், கடந்தகால தோல்வியுற்ற முயற்சிகள் மற்றும் கட்டுப்படுத்தும் நம்பிக்கைகளை விட்டுவிடுங்கள். வலியற்ற, அதிகாரம் பெற்ற வாழ்க்கைக்கு உங்கள் மூட்டுகளை மீண்டும் உருவாக்கத் தொடங்குங்கள்.",
        howItWorksTitle: "இந்தத் திட்டம் எப்படி வேலை செய்கிறது?",
        howItWorksStep1: "உங்கள் விவரங்களைச் சமர்ப்பித்து 12 நாள் இலவச சோதனைக்கு பதிவு செய்யவும்.",
        howItWorksStep2: "உங்கள் வலி நிலைகள் மற்றும் வரம்புகளைப் புரிந்துகொள்ள எங்களுக்கு உதவும் சில கேள்விகளுக்குப் பதிலளிக்கவும்.",
        howItWorksStep3: "உங்கள் நிலைக்கு ஏற்ப தனிப்பயனாக்கப்பட்ட பயிற்சிகளைப் பெறுங்கள்.",
        howItWorksStep4: "12 நாட்களுக்குப் பிறகு, உறுப்பினர் சந்தாவுடன் உங்கள் பயணத்தைத் தொடரவும்.",
        reclaimLifeTitle: "உங்கள் வாழ்க்கையை மீட்டெடுங்கள்",
        reclaimLifeText: "எங்கள் உறுப்பினர்கள் ஒரு காலத்தில் சாத்தியமற்றது என்று நினைத்த இயக்கங்களை இப்போது செய்கிறார்கள். இந்தத் திட்டம் வலியைக் குறைக்கவும், வலிமையை மேம்படுத்தவும், சமநிலையை அதிகரிக்கவும், உங்கள் உடலின் திறனில் நம்பிக்கையை அதிகரிக்கவும் உதவுகிறது.",
        ctaTitle: "இனி காத்திருக்க வேண்டாம்",
        ctaText: "இன்றே உங்கள் ₹1000 மதிப்புள்ள இலவச 12-நாள் சோதனையைத் தொடங்குங்கள்.",
        ctaButton: "உங்கள் 12-நாள் இலவச சோதனையை இப்போது தொடங்குங்கள்",
        explore: "ஆராயுங்கள்",
        courseSectionTitle: "பாடங்களின் பரந்த தேர்வு",
        assessmentTitle: "வலி மதிப்பீட்டுக் கேள்விகள்",
        assessmentIntro: "நீங்கள் தொடங்கியதும், சரியான பாதையில் உங்களுக்கு வழிகாட்ட எங்களுக்கு உதவ பின்வரும் கேள்விகளுக்கு நேர்மையாக பதிலளிக்கவும்:",
    }
};

// --- SVG Icons ---
const StarIcon = ({ filled }) => ( <svg className="star-icon" style={{ color: filled ? '#F5A623' : '#d1d7dc' }} fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /> </svg> );
const SearchIcon = () => <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const ChevronLeftIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>;

// --- Components ---
const AuthModal = ({ show, handleClose, mode, onLoginSuccess, language }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setDob('');
            setGender('');
            setError('');
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'signup') {
            try {
                const response = await axios.post(`${API_URL}/register/`, {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password,
                    date_of_birth: dob,
                    gender: gender,
                });
                onLoginSuccess(response.data);
            } catch (err) {
                const errorData = err.response?.data;
                if (errorData && errorData.email) {
                    setError(errorData.email[0]);
                } else if (errorData) {
                    const messages = Object.values(errorData).flat().join(' ');
                    setError(messages || 'Registration failed. Please check your details.');
                } else {
                    setError('An unknown error occurred.');
                }
            }
        } else { // Login mode
            try {
                const response = await axios.post(`${API_URL}/token/`, { email: email, password });
                onLoginSuccess(response.data);
            } catch (err) {
                setError('Login failed. Please check your email and password.');
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{mode === 'signup' ? content[language].signup : content[language].login}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control as="select" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="">Select Gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </Form.Control>
                            </Form.Group>
                        </>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        {mode === 'signup' ? content[language].signup : content[language].login}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
const Header = ({ language, setLanguage, user, onLogout, onShowLogin, onShowSignup }) => {
    const toggleLanguage = () => setLanguage(language === 'en' ? 'ta' : 'en');
    const navigate = useNavigate();

    const handleMyCoursesClick = () => {
        if (user) {
            navigate('/my-courses');
        } else {
            onShowLogin();
        }
    };
    
    return (
        <Navbar bg="white" expand="lg" className="app-header shadow-sm sticky-top">
            <Container fluid="xl">
                <Navbar.Brand as={Link} to="/" className="header-brand">{content[language].brand}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* UPDATED Nav.Link to handle My Courses click */}
                        <Nav.Link onClick={handleMyCoursesClick} className="header-nav-link">{content[language].myCourses}</Nav.Link>
                    </Nav>
                    <Form className="d-flex flex-grow-1 my-2 my-lg-0 mx-lg-4">
                        <div className="search-wrapper"><span className="search-icon-wrapper"><SearchIcon /></span><Form.Control type="search" placeholder={content[language].searchPlaceholder} className="search-input" /></div>
                    </Form>
                    <Nav className="align-items-center">
                        <Button variant="outline-dark" className="header-btn mx-2 my-1 my-lg-0" onClick={toggleLanguage}>{language === 'en' ? 'தமிழ்' : 'English'}</Button>
                        {user ? (
                            <>
                                <Navbar.Text className="me-2">{content[language].welcome}, {user.first_name}</Navbar.Text>
                                <Button variant="outline-dark" className="header-btn my-1 my-lg-0" onClick={onLogout}>{content[language].logout}</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline-dark" className="header-btn my-1 my-lg-0" onClick={onShowLogin}>{content[language].login}</Button>
                                <Button variant="primary" className="header-btn ms-lg-2 my-1 my-lg-0" onClick={onShowSignup}>{content[language].signup}</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

const CourseCard = ({ course, isSuperCourse }) => {
    const firstVideo = isSuperCourse ? course.courses?.[0]?.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0] : course.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0];
    const linkTo = isSuperCourse ? `/course/${course.id}?super=true` : `/course/${course.id}`;
    const price = isSuperCourse ? course.courses?.[0]?.price : course.price;


    return (
         <Link to={linkTo} className="course-card-link text-decoration-none">
            <div className="course-card">
                <Card className="border-0 h-100 bg-transparent">
                    <Card.Img 
                        variant="top" 
                        src={firstVideo?.image || 'https://placehold.co/240x135/749BC2/FFFFFF?text=Course'} 
                        className="course-card-img" 
                    />
                <Card.Body className="p-3">
                    <Card.Title className="course-card-title">{course.title}</Card.Title>
                    <Card.Text className="course-card-instructor">{firstVideo?.instructor || 'Dr. Physio'}</Card.Text>
                    <div className="d-flex align-items-center">
                        <span className="course-card-rating">{firstVideo?.rating || '4.5'}</span>
                        <StarIcon filled />
                        <span className="course-card-reviews">({firstVideo?.reviews || '1234'})</span>
                    </div>
                    <p className="course-card-price">₹{price}</p>
                    {course.bestseller && <div className="badge bestseller-badge">Bestseller</div>}
                </Card.Body>
            </Card>
            </div>
        </Link>
    );
};

const IntroSection = ({ language }) => (
    <div className="intro-section-gradient">
        <Container fluid="xl" className="py-5 text-center">
            <h1 className="main-heading text-white">{content[language].mainHeading}</h1>
            <p className="sub-heading text-white">{content[language].intro}</p>
            <p className="lead mx-auto mt-4" style={{ maxWidth: '800px' }}>{content[language].subHeading}</p>
            <p className="fw-bold mt-4">{content[language].suffering}</p>
            <p className="lead mx-auto mt-3" style={{ maxWidth: '800px' }}>{content[language].journey}</p>
        </Container>
    </div>
);

const PrinciplesSection = ({ language }) => (
    <Container fluid="xl" className="py-5 bg-white">
      <h2 className="text-center main-heading mb-5">Our Core Principles</h2>
        <Row>
            <Col md={4} className="text-center">
                <h4>{content[language].principle1Title}</h4>
                <p>{content[language].principle1Text}</p>
            </Col>
            <Col md={4} className="text-center">
                <h4>{content[language].principle2Title}</h4>
                <p>{content[language].principle2Text}</p>
            </Col>
            <Col md={4} className="text-center">
                <h4>{content[language].principle3Title}</h4>
                <p>{content[language].principle3Text}</p>
            </Col>
        </Row>
    </Container>
);

const HowItWorksSection = ({ language }) => (
     <Container fluid="xl" className="py-5">
        <h2 className="text-center main-heading mb-5">{content[language].howItWorksTitle}</h2>
        <Row className="text-center">
            <Col md={3}><strong>Step 1:</strong> {content[language].howItWorksStep1}</Col>
            <Col md={3}><strong>Step 2:</strong> {content[language].howItWorksStep2}</Col>
            <Col md={3}><strong>Step 3:</strong> {content[language].howItWorksStep3}</Col>
            <Col md={3}><strong>Step 4:</strong> {content[language].howItWorksStep4}</Col>
        </Row>
    </Container>
);

const PainAssessmentSection = ({ language }) => {
    const formUrls = {
        en: "https://docs.google.com/forms/d/e/1FAIpQLSfIaAj1pHSriX35aprHF28nDtRXEq6pDIHDVuqYd4ugXR4Peg/viewform?embedded=true",
        ta: "https://docs.google.com/forms/d/e/1FAIpQLSfMx1WBo2CvnSWlLBRHcd6gmrraAYt3A--jFGriFNrKkSc9uA/viewform?embedded=true"
    };

    return (
        <Container fluid="xl" className="py-5">
            <h2 className="text-center main-heading mb-4">{content[language].assessmentTitle}</h2>
            <p className="text-center sub-heading mx-auto" style={{ maxWidth: '800px' }}>{content[language].assessmentIntro}</p>
            <div className="google-form-container mt-5">
                <iframe
                    src={formUrls[language]}
                    width="100%"
                    height="750"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0">
                    Loading…
                </iframe>
            </div>
        </Container>
    );
};

const CtaSection = ({ language }) => (
    <Container fluid="xl" className="my-5">
      <div className="cta-section text-center">
        <h3>{content[language].reclaimLifeTitle}</h3>
        <p className="lead mx-auto" style={{ maxWidth: '700px' }}>{content[language].reclaimLifeText}</p>
        <h4 className="mt-4">{content[language].ctaTitle}</h4>
        <p>{content[language].ctaText}</p>
        <Button variant="light" size="lg" className="header-btn mt-2">{content[language].ctaButton}</Button>
      </div>
    </Container>
);

const CoursesSection = ({ language }) => {
    const [courses, setCourses] = useState([]);
    const [superCourses, setSuperCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('Pain Relief');
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Add the lang query parameter to the API calls
                const coursesResponse = await axios.get(`${API_URL}/courses/?lang=${language}`);
                setCourses(coursesResponse.data);
                const superCoursesResponse = await axios.get(`${API_URL}/super-courses/?lang=${language}`);
                setSuperCourses(superCoursesResponse.data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        fetchCourses();
    }, [language]); // Add language to the dependency array

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -scrollContainerRef.current.offsetWidth + 50 : scrollContainerRef.current.offsetWidth - 50;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <Container fluid="xl" className="py-5">
            <div className="mb-4">
                <h2 className="main-heading">{content[language].courseSectionTitle}</h2>
            </div>

            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="course-tabs">
                {["Pain Relief", "Strength Training", "Mobility & Flexibility", "Posture Correction", "Sports Injury"].map(category => (
                    <Nav.Item key={category}>
                        <Nav.Link eventKey={category}>{category}</Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            <div className="course-tab-content">
                <h3 className="explore-heading">{content[language].explore} {activeTab}</h3>
                <p>Discover top-rated programs in {activeTab} led by certified physiotherapists.</p>
                <Button variant="outline-dark" className="explore-btn">{content[language].explore} {activeTab}</Button>
                
                <div className="carousel-wrapper mt-4">
                   <Button onClick={() => scroll('left')} variant="light" className="scroll-btn scroll-btn-left"><ChevronLeftIcon/></Button>
                    <div ref={scrollContainerRef} className="course-carousel">
                        {superCourses.map(course => <CourseCard key={course.id} course={course} isSuperCourse={true} />)}
                        {courses.map(course => <CourseCard key={course.id} course={course} />)}
                    </div>
                   <Button onClick={() => scroll('right')} variant="light" className="scroll-btn scroll-btn-right"><ChevronRightIcon/></Button>
                </div>
            </div>
        </Container>
    );
};
// --- FINAL App Component ---
export default function App() {
    const [language, setLanguage] = useState('en');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('login');
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (authToken) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
                    const userResponse = await axios.get(`${API_URL}/user/`);
                    setCurrentUser(userResponse.data);
                } catch (error) {
                    handleLogout();
                }
            }
        };
        fetchUser();
    }, [authToken]);

    const handleShowLogin = () => { setModalMode('login'); setShowModal(true); };
    const handleShowSignup = () => { setModalMode('signup'); setShowModal(true); };
    const handleCloseModal = () => setShowModal(false);

    const handleLoginSuccess = (data) => {
        localStorage.setItem('authToken', data.access);
        setAuthToken(data.access);
        handleCloseModal();
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setAuthToken(null);
        setCurrentUser(null);
        navigate('/');
    };
    
    return (
        <div className="app-container">
            <Header
                language={language}
                setLanguage={setLanguage}
                user={currentUser}
                onLogout={handleLogout}
                onShowLogin={handleShowLogin}
                onShowSignup={handleShowSignup}
            />
            <AuthModal
                show={showModal}
                handleClose={handleCloseModal}
                mode={modalMode}
                onLoginSuccess={handleLoginSuccess}
                language={language}
            />
            <main>
                <Routes>
                    {/* Main homepage route with ALL sections restored */}
                    <Route path="/" element={
                        <>
                            <IntroSection language={language} />
                            <PrinciplesSection language={language} />
                            <HowItWorksSection language={language} />
                            <CoursesSection language={language} />
                            <CtaSection language={language} />
                            <PainAssessmentSection language={language} />
                        </>
                    } />
                    
                    <Route 
                        path="/course/:courseId" 
                        element={<CoursePage user={currentUser} token={authToken} showLogin={handleShowLogin} language={language} />} 
                    />
                    
                    <Route path="/player/:courseId/phase/:phaseId" element={
                        <ProtectedRoute user={currentUser}>
                            <VideoPlayerPage language={language} />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/my-courses" element={
                        <ProtectedRoute user={currentUser}>
                            <MyCoursesPage language={language} />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
}