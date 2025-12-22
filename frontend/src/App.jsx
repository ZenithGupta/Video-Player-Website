import React, { useState, useRef, useEffect } from 'react';
import { Container, Navbar, Nav, Form, Button, Card, CloseButton, Row, Col, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// GSAP Imports
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

import VideoPlayerPage from './VideoPlayerPage.jsx';
import CoursePage from './CoursePage.jsx';
import MyCoursesPage from './MyCoursesPage.jsx';
import PurchaseHistoryPage from './PurchaseHistoryPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import TermsPage from './TermsPage.jsx';
import SocialMediaSidebar from './SocialMediaSidebar.jsx';

import API_URL, { GOOGLE_FORM_ENTRY_IDS } from './config/api.js';
import './index.css';

// Register GSAP Plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);

// --- API Base URL ---
// const API_URL = 'http://127.0.0.1:8000/api';

// --- Language Content ---
const content = {
    en: {
        brand: "One Last Move",
        home: "Home",
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

        // --- TRANSLATION ADDED HERE ---
        principlesTitle: "Our Core Principles",
        principle1Title: "1. Understanding the Root Cause",
        principle1Text: "The primary reason you still experience pain is the lack of a proper understanding of what’s actuallycausing it. This program helps you get to the root of your problem and teaches you how to resolve it with the right movements and awareness.",
        principle2Title: "2. What Truly Deserves Attention?",
        principle2Text: "Will you continue to focus only on your X-rays and MRI reports? Or will you focus on the real cause of your joint and hip pain? If you can fix the other underlying issues—not just the degeneration—you can regain pain-free movements.",
        principle3Title: "3. Dedication is Key",
        principle3Text: "With the right understanding and the correct plan in hand, staying dedicated to your recovery becomes easier. Let go of fear, past failed attempts, and limiting beliefs. Start rebuilding your joints to a pain-free, empowered life.",

        howItWorksTitle: "How Does the Program Work?",
        howItWorksStep1: "Sign up for the 14-day free trial by submitting your details.",
        howItWorksStep2: "Answer a few questions to help us understand your pain levels and limitations.",
        howItWorksStep3: "Get customized exercises tailored to your condition.",
        howItWorksStep4: "After 14 days, continue your journey with a membership.",
        reclaimLifeTitle: "Reclaim Your Life",
        reclaimLifeText: "Our members are now performing movements they once thought impossible. This program helps reduce pain, improve strength, enhance balance, and boost confidence in your body's ability.",
        ctaTitle: "Don’t Wait Any Longer",
        ctaText: "Get started with your free 14-day trial worth ₹1000 today.",
        ctaButton: "Start Your 14-Day Free Trial Now",
        explore: "Explore",
        courseSectionTitle: "A broad selection of courses",
        assessmentTitle: "Pain Assessment Questions",
        assessmentIntro: "Once you begin, answer the following questions honestly to help us guide you on the right path:",
        terms: "Terms",
        about: "About",
        aboutTitle: "About Us",
        aboutSubtitle: "A Journey to Mobility",
        aboutDescription: [
            "Aravinth E is a dedicated physiotherapist, nutritionist, and YouTube creator who specializes in helping people over the age of 50 with arthritis and mobility issues.",
            "After discovering a passion for helping people regain mobility and independence, Aravinth started his own physiotherapy center, Physio Pride, in 2020. Quickly building a fantastic reputation in the local area, Aravinth decided to share the same expert guidance he provided to his in-person clients with the wider community. This led to the creation of his YouTube channel, which has since amassed more than 1 lakh (100,000) subscribers worldwide, with his videos gaining millions of views every month.",
            "In 2024, seeing the immense need, he started live online exercise sessions for clients across India and globally, deciding to take his outreach to the next level.",
            "The following year, in 2025, Aravinth opened his second branch of Physio Pride. He also began working on a prerecorded online exercise program called \"One Last Move,\" specifically designed for elders and individuals who suffer from knee arthritis and back pain in their daily lives.",
            "Today, Aravinth focuses his time on building and training his highly-skilled, specialist team at Physio Pride. Together, they help countless elders and arthritic people all over the world through online programs, while Aravinth continues creating content for his YouTube channel and treating patients in his centers."
        ],
    },
    ta: {
        brand: "ஒரு கடைசி நகர்வு",
        home: "முகப்பு",
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

        // --- TRANSLATION ADDED HERE ---
        principlesTitle: "எங்கள் முக்கிய கொள்கைகள்",
        principle1Title: "1. மூல காரணத்தைப் புரிந்துகொள்வது",
        principle1Text: "நீங்கள் இன்னும் வலியை அனுபவிப்பதற்கு முக்கிய காரணம், உண்மையான காரணம் என்ன என்பதைப் பற்றிய சரியான புரிதல் இல்லாததுதான். இந்தத் திட்டம் உங்கள் பிரச்சனையின் மூல காரணத்தைக் கண்டறிந்து, சரியான இயக்கங்கள் மற்றும் விழிப்புணர்வுடன் அதை எவ்வாறு தீர்ப்பது என்று உங்களுக்குக் கற்பிக்கிறது.",
        principle2Title: "2. உண்மையிலேயே கவனம் செலுத்த வேண்டியது என்ன?",
        principle2Text: "உங்கள் எக்ஸ்-ரே மற்றும் எம்ஆர்ஐ அறிக்கைகளில் மட்டுமே கவனம் செலுத்துவீர்களா? அல்லது உங்கள் மூட்டு மற்றும் இடுப்பு வலியின் உண்மையான காரணத்தில் கவனம் செலுத்துவீர்களா? தேய்மானத்தை மட்டுமல்ல, மற்ற அடிப்படைப் பிரச்சனைகளையும் சரிசெய்தால், வலியற்ற இயக்கங்களை மீண்டும் பெறலாம்.",
        principle3Title: "3. அர்ப்பணிப்பு முக்கியம்",
        principle3Text: "சரியான புரிதலுடனும், சரியான திட்டத்துடனும், உங்கள் மீட்புக்கு அர்ப்பணிப்புடன் இருப்பது எளிதாகிறது. பயம், கடந்தகால தோல்வியுற்ற முயற்சிகள் மற்றும் கட்டுப்படுத்தும் நம்பிக்கைகளை விட்டுவிடுங்கள். வலியற்ற, அதிகாரம் பெற்ற வாழ்க்கைக்கு உங்கள் மூட்டுகளை மீண்டும் உருவாக்கத் தொடங்குங்கள்.",

        howItWorksTitle: "இந்தத் திட்டம் எப்படி வேலை செய்கிறது?",
        howItWorksStep1: "உங்கள் விவரங்களைச் சமர்ப்பித்து 14 நாள் இலவச சோதனைக்கு பதிவு செய்யவும்.",
        howItWorksStep2: "உங்கள் வலி நிலைகள் மற்றும் வரம்புகளைப் புரிந்துகொள்ள எங்களுக்கு உதவும் சில கேள்விகளுக்குப் பதிலளிக்கவும்.",
        howItWorksStep3: "உங்கள் நிலைக்கு ஏற்ப தனிப்பயனாக்கப்பட்ட பயிற்சிகளைப் பெறுங்கள்.",
        howItWorksStep4: "14 நாட்களுக்குப் பிறகு, உறுப்பினர் சந்தாவுடன் உங்கள் பயணத்தைத் தொடரவும்.",
        reclaimLifeTitle: "உங்கள் வாழ்க்கையை மீட்டெடுங்கள்",
        reclaimLifeText: "எங்கள் உறுப்பினர்கள் ஒரு காலத்தில் சாத்தியமற்றது என்று நினைத்த இயக்கங்களை இப்போது செய்கிறார்கள். இந்தத் திட்டம் வலியைக் குறைக்கவும், வலிமையை மேம்படுத்தவும், சமநிலையை அதிகரிக்கவும், உங்கள் உடலின் திறனில் நம்பிக்கையை அதிகரிக்கவும் உதவுகிறது.",
        ctaTitle: "இனி காத்திருக்க வேண்டாம்",
        ctaText: "இன்றே உங்கள் ₹1000 மதிப்புள்ள இலவச 14-நாள் சோதனையைத் தொடங்குங்கள்.",
        ctaButton: "உங்கள் 14-நாள் இலவச சோதனையை இப்போது தொடங்குங்கள்",
        explore: "ஆராயுங்கள்",
        courseSectionTitle: "பாடங்களின் பரந்த தேர்வு",
        assessmentTitle: "வலி மதிப்பீட்டுக் கேள்விகள்",
        assessmentIntro: "நீங்கள் தொடங்கியதும், சரியான பாதையில் உங்களுக்கு வழிகாட்ட எங்களுக்கு உதவ பின்வரும் கேள்விகளுக்கு நேர்மையாக பதிலளிக்கவும்:",
        terms: "விதிமுறைகள்",
        about: "எங்களைப் பற்றி",
        aboutTitle: "எங்களைப் பற்றி",
        aboutSubtitle: "இயக்கம் நோக்கிய ஒரு பயணம்",
        aboutDescription: [
            "அரவிந்த் அவர்கள் ஒரு அர்ப்பணிப்புள்ள பிசியோதெரபிஸ்ட், ஊட்டச்சத்து நிபுணர், மற்றும் யூடியூப் படைப்பாளி ஆவார். இவர் 50 வயதிற்கு மேற்பட்டவர்கள், மூட்டுவலி மற்றும் இயக்கம் தொடர்பான பிரச்சனைகளால் பாதிக்கப்பட்டவர்களுக்கு உதவுவதில் நிபுணத்துவம் பெற்றவர்.",
            "மக்களின் இயக்கத்தை மீட்டெடுப்பதிலும், அவர்கள் சுதந்திரமாகச் செயல்பட உதவுவதிலும் தனக்கிருந்த ஆர்வத்தைக் கண்டறிந்த பிறகு, அரவிந்த் அவர்கள் 2020 ஆம் ஆண்டில், பிசியோ ப்ரைடு என்ற தனது சொந்த பிசியோதெரபி மையத்தைத் தொடங்கினார். குறுகிய காலத்திலேயே உள்ளூர் அளவில் ஒரு சிறப்பான நற்பெயரைக் கட்டியெழுப்பிய அரவிந்த், தான் நேரடியாகச் சந்திக்கும் நோயாளிகளுக்கு வழங்கும் அதே சிறப்பு வாய்ந்த ஆலோசனைகளை பரந்த சமூகத்துடனும் பகிர்ந்து கொள்ள முடிவு செய்தார். இதன் விளைவாகவே அவரது யூடியூப் சேனல் உருவாக்கப்பட்டது. இந்த சேனல் உலகளவில் ஒரு லட்சம் (100,000) சந்தாதாரர்களுக்கு மேல் பெற்றுள்ளதுடன், அவரது வீடியோக்கள் ஒவ்வொரு மாதமும் பல மில்லியன் பார்வைகளைப் பெறுகின்றன.",
            "2024 ஆம் ஆண்டில், இத்தகைய தேவையின் தீவிரத்தை உணர்ந்த அவர், இந்தியா மற்றும் உலகெங்கிலும் உள்ள நோயாளிகளுக்காக நேரடி ஆன்லைன் உடற்பயிற்சிக் கூட்டங்களைத் (live online exercise sessions) தொடங்கினார். இது அவரது சேவையை அடுத்த கட்டத்திற்கு எடுத்துச் செல்லும் முடிவாக இருந்தது.",
            "அடுத்த ஆண்டு, 2025 இல், அரவிந்த் அவர்கள் பிசியோ ப்ரைடு மையத்தின் இரண்டாவது கிளையைத் திறந்தார். மேலும், முதியவர்கள் மற்றும் அன்றாட வாழ்வில் மூட்டுவலி (knee arthritis), முதுகு வலியால் (back pain) பாதிக்கப்படுபவர்களுக்காகவே சிறப்பாக வடிவமைக்கப்பட்ட \"ஒரு கடைசி நகர்வு\" என்ற பெயரில், முன் பதிவு செய்யப்பட்ட இணையவழி உடற்பயிற்சி திட்டத்திலும் அவர் பணியாற்றத் தொடங்கினார்.",
            "இன்று, அரவிந்த் அவர்கள் பிசியோ ப்ரைடு மையத்தில் தனது உயர் திறமை வாய்ந்த, சிறப்பு நிபுணர் குழுவை உருவாக்குவதிலும், பயிற்சி அளிப்பதிலும் தனது நேரத்தைச் செலுத்துகிறார். இக்குழுவினர், ஆன்லைன் திட்டங்கள் மூலம் உலகெங்கிலும் உள்ள எண்ணற்ற முதியோர்களுக்கும், மூட்டுவலியால் பாதிக்கப்பட்டவர்களுக்கும் உதவுகின்றனர். அத்துடன், அரவிந்த் அவர்கள் தொடர்ந்து தனது யூடியூப் சேனலுக்கான உள்ளடக்கத்தை உருவாக்கி வருவதுடன், தனது மையங்களில் நோயாளிகளுக்கும் சிகிச்சை அளித்து வருகிறார்."
        ],
    }
};

// --- SVG Icons ---
const StarIcon = ({ filled }) => (<svg className="star-icon" style={{ color: filled ? '#F5A623' : '#d1d7dc' }} fill="currentColor" viewBox="0 0 20 20"> <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /> </svg>);
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
                if (err.response && err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError('Login failed. Please check your email and password.');
                }
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
    // --- NAVBAR COLLAPSE FIX: Add state for menu ---
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const t = content[language]; // Get translation object

    // --- NAVBAR COLLAPSE FIX: Create wrapped handlers ---
    const handleToggleLanguage = () => {
        setLanguage(language === 'en' ? 'ta' : 'en');
        setExpanded(false); // Close menu
    };

    const handleMyCoursesClick = () => {
        if (user) {
            navigate('/my-courses');
        } else {
            onShowLogin();
        }
        setExpanded(false); // Close menu
    };

    const handleLoginClick = () => {
        onShowLogin();
        setExpanded(false); // Close menu
    };

    const handleSignupClick = () => {
        onShowSignup();
        setExpanded(false); // Close menu
    };

    const handleLogoutClick = () => {
        onLogout();
        setExpanded(false); // Close menu
    };

    const handleBrandClick = () => {
        // We don't need to navigate if we are already on '/', but closing the menu is important
        setExpanded(false);
    }

    return (
        // --- NAVBAR COLLAPSE FIX: Add expanded and onToggle props ---
        <Navbar bg="white" expand="lg" className="app-header shadow-sm sticky-top" expanded={expanded} onToggle={setExpanded}>
            <Container fluid="xl">
                {/* --- NAVBAR COLLAPSE FIX: Use Link component and add onClick --- */}
                <Navbar.Brand as={Link} to="/" onClick={handleBrandClick} className="header-brand">
                    <img
                        src="/logo/WebsiteLogo.png"
                        alt={t.brand}
                        style={{ height: '50px', width: 'auto' }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto"></Nav>

                    <Nav className="align-items-center">
                        <Button as={Link} to="/" variant="outline-dark" className="header-btn mx-2 my-1 my-lg-0" onClick={() => setExpanded(false)}>{t.home}</Button>
                        {/* --- NAVBAR COLLAPSE FIX: Use wrapped handler --- */}
                        <Button variant="outline-dark" className="header-btn mx-2 my-1 my-lg-0" onClick={handleMyCoursesClick}>
                            {t.myCourses}
                        </Button>

                        {user && (
                            <Button as={Link} to="/purchase-history" variant="outline-dark" className="header-btn mx-2 my-1 my-lg-0" onClick={() => setExpanded(false)}>
                                History
                            </Button>
                        )}

                        <Button as={Link} to="/terms" variant="outline-dark" className="header-btn mx-2 my-1 my-lg-0" onClick={() => setExpanded(false)}>{t.terms}</Button>

                        {/* --- NAVBAR COLLAPSE FIX: Use wrapped handler --- */}
                        <Button variant="outline-dark" className="header-btn mx-2 my-1 my-lg-0" onClick={handleToggleLanguage}>{language === 'en' ? 'தமிழ்' : 'English'}</Button>
                        {user ? (
                            <>
                                <Navbar.Text className="me-2">{t.welcome}, {user.first_name}</Navbar.Text>
                                {/* --- NAVBAR COLLAPSE FIX: Use wrapped handler --- */}
                                <Button variant="outline-dark" className="header-btn my-1 my-lg-0" onClick={handleLogoutClick}>{t.logout}</Button>
                            </>
                        ) : (
                            <>
                                {/* --- NAVBAR COLLAPSE FIX: Use wrapped handler --- */}
                                <Button variant="outline-dark" className="header-btn my-1 my-lg-0" onClick={handleLoginClick}>{t.login}</Button>
                                {/* --- NAVBAR COLLAPSE FIX: Use wrapped handler --- */}
                                <Button variant="primary" className="header-btn ms-lg-2 my-1 my-lg-0" onClick={handleSignupClick}>{t.signup}</Button>
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
    // Use course.rating if present, else fallback to 4.5
    const rating = course.rating || '4.5';
    // Use proper image source based on whether it is a SuperCourse or Course
    const imageUrl = isSuperCourse
        ? (course.image || 'https://placehold.co/240x135/749BC2/FFFFFF?text=Course')
        : (course.super_course_image || 'https://placehold.co/240x135/749BC2/FFFFFF?text=Course');

    return (
        <Link to={linkTo} className="course-card-link text-decoration-none">
            <div className="course-card">
                <Card className="border-0 h-100 bg-transparent">
                    <Card.Img
                        variant="top"
                        src={imageUrl}
                        className="course-card-img"
                    />
                    <Card.Body className="p-3">
                        <Card.Title className="course-card-title">{course.title}</Card.Title>
                        <div className="d-flex align-items-center">
                            <span className="course-card-rating">{rating}</span>
                            <StarIcon filled />
                            {/* <span className="course-card-reviews">({firstVideo?.reviews || '1234'})</span> */}
                        </div>
                        <p className="course-card-price">₹{price}</p>
                        {course.bestseller && <div className="badge bestseller-badge">Bestseller</div>}
                    </Card.Body>
                </Card>
            </div>
        </Link>
    );
};

const HeroSection = ({ language }) => {
    const heroRef = useRef(null);
    const quoteBoxRef = useRef(null);

    useGSAP(() => {
        // Fade in the quote box with scale animation on page load
        gsap.from(quoteBoxRef.current, {
            duration: 1.5,
            opacity: 0,
            scale: 0.8,
            y: 50,
            ease: "power3.out",
            delay: 0.3
        });

        // Parallax effect for background on scroll
        if (quoteBoxRef.current) {
            gsap.to(".hero-background", {
                scale: 1.1,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }, { scope: heroRef, dependencies: [language], revertOnUpdate: true });

    return (
        <div className="hero-section" ref={heroRef}>
            <div className="hero-background">
                <img
                    src="/logo/NatureBackground.jpg"
                    alt="Nature Background"
                    className="hero-bg-image"
                />
            </div>
            <Container fluid="xl" className="hero-content">
                <div className="hero-quote-box" ref={quoteBoxRef}>
                    <img
                        src="/logo/WebsiteQuote.png"
                        alt="Website Quote"
                        className="hero-quote-image"
                    />
                </div>
            </Container>
        </div>
    );
};

const IntroSection = ({ language }) => {
    const introRef = useRef(null);
    const t = content[language]; // Get translation object

    useGSAP(() => {
        // Scramble Text for the main heading
        gsap.to(".main-heading-scramble", {
            duration: 2,
            scrambleText: {
                text: t.mainHeading, // Use translated text
                chars: "lowerCase",
                speed: 0.3
            }
        });

        // Staggered fade-in for other elements
        gsap.from(".intro-fade-in", {
            duration: 1,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            delay: 1
        });
    }, { scope: introRef, dependencies: [language], revertOnUpdate: true });

    return (
        <div className="intro-section-gradient" ref={introRef}>
            <Container fluid="xl" className="py-5 text-center">
                <h1 className="main-heading text-white main-heading-scramble"></h1>
                <p className="sub-heading text-white intro-fade-in">{t.intro}</p>
                <p className="lead mx-auto mt-4 intro-fade-in" style={{ maxWidth: '800px' }}>{t.subHeading}</p>
                <p className="fw-bold mt-4 intro-fade-in">{t.suffering}</p>
                <p className="lead mx-auto mt-3 intro-fade-in" style={{ maxWidth: '800px' }}>{t.journey}</p>
            </Container>
        </div>
    );
};

const PrinciplesSection = ({ language }) => {
    const principlesRef = useRef(null);
    const t = content[language]; // Get translation object

    useGSAP(() => {
        const split = new SplitText(".principles-title", { type: "words,chars" });
        const chars = split.chars;

        gsap.from(chars, {
            duration: 0.8,
            opacity: 0,
            y: 20,
            ease: "back",
            stagger: 0.05,
            scrollTrigger: {
                trigger: principlesRef.current,
                start: "top 80%",
            }
        });

        gsap.from(".principle-col", {
            duration: 1,
            opacity: 0,
            y: 50,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".principles-title",
                start: "bottom 80%",
            }
        });
    }, { scope: principlesRef, dependencies: [language], revertOnUpdate: true });

    return (
        <Container fluid="xl" className="py-5 bg-white" ref={principlesRef}>
            {/* --- TRANSLATION FIX: Use translated title --- */}
            <h2 className="text-center main-heading mb-5 principles-title">{t.principlesTitle}</h2>
            <Row>
                <Col md={4} className="text-center principle-col">
                    <h4>{t.principle1Title}</h4>
                    <p>{t.principle1Text}</p>
                </Col>
                <Col md={4} className="text-center principle-col">
                    <h4>{t.principle2Title}</h4>
                    <p>{t.principle2Text}</p>
                </Col>
                <Col md={4} className="text-center principle-col">
                    <h4>{t.principle3Title}</h4>
                    <p>{t.principle3Text}</p>
                </Col>
            </Row>
        </Container>
    );
};

const HowItWorksSection = ({ language }) => {
    const howItWorksRef = useRef(null);
    const t = content[language]; // Get translation object

    useGSAP(() => {
        gsap.from(".how-it-works-title", {
            duration: 1,
            opacity: 0,
            y: -50,
            scrollTrigger: {
                trigger: howItWorksRef.current,
                start: "top 80%"
            }
        });

        gsap.from(".how-it-works-step", {
            duration: 0.8,
            opacity: 0,
            scale: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".how-it-works-title",
                start: "bottom 90%"
            }
        });
    }, { scope: howItWorksRef, dependencies: [language], revertOnUpdate: true });

    return (
        <Container fluid="xl" className="py-5" ref={howItWorksRef}>
            <h2 className="text-center main-heading mb-5 how-it-works-title">{t.howItWorksTitle}</h2>
            <Row className="text-center">
                <Col md={3} className="how-it-works-step"><strong>Step 1:</strong> {t.howItWorksStep1}</Col>
                <Col md={3} className="how-it-works-step"><strong>Step 2:</strong> {t.howItWorksStep2}</Col>
                <Col md={3} className="how-it-works-step"><strong>Step 3:</strong> {t.howItWorksStep3}</Col>
                <Col md={3} className="how-it-works-step"><strong>Step 4:</strong> {t.howItWorksStep4}</Col>
            </Row>
        </Container>
    );
};

const PainAssessmentSection = ({ language, showForm, formRef, onFormSubmit, currentUser, googleFormEntryId }) => {
    const formUrls = {
        en: "https://docs.google.com/forms/d/e/1FAIpQLSfIaAj1pHSriX35aprHF28nDtRXEq6pDIHDVuqYd4ugXR4Peg/viewform?embedded=true",
        ta: "https://docs.google.com/forms/d/e/1FAIpQLSfMx1WBo2CvnSWlLBRHcd6gmrraAYt3A--jFGriFNrKkSc9uA/viewform?embedded=true"
    };
    const iframeRef = useRef(null);
    const t = content[language]; // Get translation object

    useEffect(() => {
        if (!showForm || !iframeRef.current) return;

        let checkCount = 0;
        const maxChecks = 300; // Stop checking after 10 minutes (300 * 2 seconds)
        let initialUrl = '';
        let interval = null;

        // Monitor iframe for form submission by checking URL changes and content
        const checkFormSubmission = () => {
            try {
                const iframe = iframeRef.current;
                if (!iframe) return;

                checkCount++;
                if (checkCount > maxChecks) {
                    if (interval) clearInterval(interval);
                    return;
                }

                // Method 1: Check iframe URL changes (Google Forms changes URL after submission)
                try {
                    const currentSrc = iframe.src || '';
                    if (!initialUrl) {
                        initialUrl = currentSrc;
                    } else if (currentSrc !== initialUrl && currentSrc.includes('formResponse')) {
                        // URL changed and contains 'formResponse' - form was likely submitted
                        if (onFormSubmit) {
                            onFormSubmit();
                            if (interval) clearInterval(interval);
                            return;
                        }
                    }
                } catch (e) {
                    // Cross-origin restrictions - continue with other methods
                }

                // Method 2: Try to access iframe content (may fail due to CORS)
                try {
                    if (iframe.contentDocument) {
                        const doc = iframe.contentDocument;
                        const body = doc.body;
                        if (body) {
                            const text = (body.innerText || body.textContent || '').toLowerCase();
                            // Google Forms shows "Submit another response" after successful submission
                            // Also check for other indicators
                            if (text.includes('submit another response') ||
                                text.includes('your response has been recorded') ||
                                text.includes('response was recorded') ||
                                (text.includes('thank you') && (text.includes('response') || text.includes('submitted'))) ||
                                text.includes('response recorded')) {
                                // Form submitted, hide it
                                if (onFormSubmit) {
                                    onFormSubmit();
                                    if (interval) clearInterval(interval);
                                    return;
                                }
                            }
                        }
                    }
                } catch (e) {
                    // Cross-origin restrictions - this is expected for Google Forms
                    // We can't access iframe content due to CORS, but we try anyway
                }

                // Method 3: Check for URL parameter changes in the iframe src
                try {
                    const currentSrc = iframe.src || '';
                    // After submission, Google Forms might add query parameters
                    if (currentSrc.includes('formResponse') || currentSrc.includes('submit')) {
                        if (onFormSubmit && currentSrc !== initialUrl) {
                            onFormSubmit();
                            if (interval) clearInterval(interval);
                            return;
                        }
                    }
                } catch (e) {
                    // Continue
                }
            } catch (e) {
                // General error handling
            }
        };

        // Check every 2 seconds for form submission
        interval = setInterval(checkFormSubmission, 2000);

        // Also listen for postMessage events from Google Forms
        const handleMessage = (event) => {
            // Google Forms may send messages on submission
            if (event.data) {
                const dataStr = typeof event.data === 'string' ? event.data : JSON.stringify(event.data || {});
                if (dataStr.includes('formSubmitted') ||
                    dataStr.includes('submit-success') ||
                    dataStr.includes('form-submit') ||
                    dataStr.includes('submit') ||
                    (event.data && typeof event.data === 'object' && event.data.type && event.data.type.includes('submit'))) {
                    if (onFormSubmit) {
                        onFormSubmit();
                        if (interval) clearInterval(interval);
                    }
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            if (interval) clearInterval(interval);
            window.removeEventListener('message', handleMessage);
        };
    }, [showForm, onFormSubmit]);

    if (!showForm) return null;

    return (
        <Container fluid="xl" className="py-5" ref={formRef}>
            <h2 className="text-center main-heading mb-4">{t.assessmentTitle}</h2>
            <p className="text-center sub-heading mx-auto mb-4" style={{ maxWidth: '800px' }}>{t.assessmentIntro}</p>
            <div className="google-form-container mt-5">
                <iframe
                    ref={iframeRef}
                    src={(() => {
                        let src = formUrls[language];
                        // If we have a logged-in user and a prefill entry id, append the prefilled user email
                        try {
                            if (currentUser && currentUser.email && googleFormEntryId) {
                                // formUrls already include ?embedded=true, so append with &
                                src += '&entry.' + encodeURIComponent(googleFormEntryId) + '=' + encodeURIComponent(currentUser.email);
                            }
                        } catch (e) {
                            // ignore
                        }
                        return src;
                    })()}
                    width="100%"
                    height="750"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    title="Pain Assessment Form">
                    Loading…
                </iframe>
            </div>
            <div className="text-center mt-4">
                <Button variant="outline-secondary" size="sm" onClick={() => onFormSubmit && onFormSubmit()}>
                    Close Form
                </Button>
            </div>
        </Container>
    );
};

const CtaSection = ({ language, onFreeTrialClick }) => {
    const ctaRef = useRef(null);
    const t = content[language]; // Get translation object

    useGSAP(() => {
        const split = new SplitText(".cta-title-split", { type: "words" });
        const words = split.words;

        gsap.from(words, {
            duration: 1,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 80%",
            }
        });

        gsap.from(".cta-fade-in", {
            duration: 1,
            opacity: 0,
            delay: 0.5,
            scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 70%",
            }
        });

        return () => {
            gsap.set(".cta-fade-in", { opacity: 1 });
        };
    }, { scope: ctaRef, dependencies: [language], revertOnUpdate: true });

    const handleButtonClick = () => {
        if (onFreeTrialClick) {
            onFreeTrialClick();
        }
    };

    return (
        <div className="cta-section my-5" ref={ctaRef}>
            <Container fluid="xl" className="text-center">
                <h3 className="cta-title-split">{t.reclaimLifeTitle}</h3>
                <p className="lead mx-auto cta-fade-in" style={{ maxWidth: '700px' }}>{t.reclaimLifeText}</p>
                <h4 className="mt-4 cta-fade-in">{t.ctaTitle}</h4>
                <p className="cta-fade-in">{t.ctaText}</p>
                <Button variant="light" size="lg" className="header-btn mt-2 cta-fade-in" onClick={handleButtonClick}>{t.ctaButton}</Button>
            </Container>
        </div>
    );
};

const CoursesSection = ({ language }) => {
    const [courses, setCourses] = useState([]);
    const [superCourses, setSuperCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('Pain Relief');
    const scrollContainerRef = useRef(null);
    const coursesRef = useRef(null);
    const t = content[language]; // Get translation object

    useGSAP(() => {
        gsap.from(".course-section-title-split", {
            duration: 1,
            opacity: 0,
            y: -30,
            scrollTrigger: {
                trigger: coursesRef.current,
                start: "top 80%"
            }
        });
    }, { scope: coursesRef, dependencies: [language], revertOnUpdate: true });


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesResponse = await axios.get(`${API_URL}/courses/?lang=${language}`);
                setCourses(coursesResponse.data);
                const superCoursesResponse = await axios.get(`${API_URL}/super-courses/?lang=${language}`);
                setSuperCourses(superCoursesResponse.data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        fetchCourses();
    }, [language]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -scrollContainerRef.current.offsetWidth + 50 : scrollContainerRef.current.offsetWidth - 50;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <Container fluid="xl" className="py-5" ref={coursesRef}>
            <div className="mb-4">
                <h2 className="main-heading course-section-title-split">{t.courseSectionTitle}</h2>
            </div>

            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="course-tabs">
                {["Pain Relief", "Strength Training", "Mobility & Flexibility", "Posture Correction", "Sports Injury"].map(category => (
                    <Nav.Item key={category}>
                        <Nav.Link eventKey={category}>{category}</Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            <div className="course-tab-content">
                <h3 className="explore-heading">{t.explore} {activeTab}</h3>
                <p>Discover top-rated programs in {activeTab} led by certified physiotherapists.</p>
                <Button variant="outline-dark" className="explore-btn">{t.explore} {activeTab}</Button>

                <div className="carousel-wrapper mt-4">
                    <Button onClick={() => scroll('left')} variant="light" className="scroll-btn scroll-btn-left"><ChevronLeftIcon /></Button>
                    <div ref={scrollContainerRef} className="course-carousel">
                        {superCourses.map(course => <CourseCard key={course.id} course={course} isSuperCourse={true} />)}
                        {courses.map(course => <CourseCard key={course.id} course={course} />)}
                    </div>
                    <Button onClick={() => scroll('right')} variant="light" className="scroll-btn scroll-btn-right"><ChevronRightIcon /></Button>
                </div>
            </div>
        </Container>
    );
};

// Replicated section copied from Lifelong Mobility (layout + text + image)
const AboutSection = ({ language }) => {
    const t = content[language];
    // console.log("AboutSection rendering", { title: t.aboutTitle, subtitle: t.aboutSubtitle });
    return (
        <div className="full-gradient-bg intro-section-gradient" style={{ overflow: 'hidden' }}>
            <style>{`
    /* Replicated block styles (kept scoped by #lifelong-block) */
    .full-gradient-bg {
        width: 100%;
        padding-top: 40px;
        padding-bottom: 80px; /* make sure following section is pushed below */
        box-sizing: border-box;
    }
    #lifelong-block {
        margin-top: 0px;
        margin-bottom: 0px;
    }
    #lifelong-block .block {
        border: 0 none;
        padding: 0;
    }
    #lifelong-block .row {
        align-items: center;
        justify-content: center;
    }
    #lifelong-block .lifelong-image {
        width: 100%;
        border-radius: 8px;
        object-fit: cover;
        display: block;
        max-height: 680px;
    }
    #lifelong-block .lifelong-content {
        padding: 10px 20px;
    }
    @media (min-width: 768px) {
        #lifelong-block .lifelong-content {
            padding-left: 40px;
        }
    }
    @media (min-width: 1200px) {
        .full-gradient-bg {
            padding-bottom: 120px; /* more spacing on large screens */
        }
    }
`}</style>

            <Container fluid="xl" className="py-5" id="lifelong-block">
                <div className="row">
                    <div className="col-12 col-md-5">
                        <div className="block">
                            <img src="/logo/Aravinth's Image.png" alt="Profile" className="lifelong-image" />
                        </div>
                    </div>
                    <div className="col-12 col-md-7">
                        <div className="lifelong-content">
                            <h2 className="main-heading">{t.aboutSubtitle}</h2>
                            <div>
                                {t.aboutDescription.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

// --- FINAL App Component ---
export default function App() {
    const [language, setLanguage] = useState('en');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('login');
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [currentUser, setCurrentUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    // When a non-logged-in user clicks the free-trial CTA we mark a pending flag
    // so we can show the Google Form only after a successful login.
    const [showFormPending, setShowFormPending] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            if (authToken) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
                    const userResponse = await axios.get(`${API_URL}/user/`);
                    setCurrentUser(userResponse.data);
                } catch (error) {
                    // We don't logout here anymore, because the interceptor below will handle 401s
                    console.log("User fetch failed, but waiting for interceptor...", error);
                }
            }
        };

        fetchUser();
    }, [authToken]);

    // AXIOS INTERCEPTOR FOR TOKEN REFRESH
    // This ensures that if the access token expires (401), we try to refresh it
    // using the refresh token before logging the user out.
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response, // Return success responses as is
            async (error) => {
                const originalRequest = error.config;

                // Check if error is 401 (Unauthorized) and we haven't tried refreshing yet
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true; // Mark request as retried
                    const refreshToken = localStorage.getItem('refreshToken');

                    if (refreshToken) {
                        try {
                            // Attempt to get a new access token
                            const response = await axios.post(`${API_URL}/token/refresh/`, {
                                refresh: refreshToken
                            });

                            if (response.status === 200) {
                                const newAccessToken = response.data.access;

                                // Update storage and state
                                localStorage.setItem('authToken', newAccessToken);
                                if (response.data.refresh) {
                                    localStorage.setItem('refreshToken', response.data.refresh);
                                }
                                setAuthToken(newAccessToken);

                                // Update default header and retry the original request
                                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                                return axios(originalRequest);
                            }
                        } catch (refreshError) {
                            // If refresh fails (e.g., refresh token also expired), logout
                            console.error("Token refresh failed:", refreshError);
                            handleLogout();
                        }
                    } else {
                        // No refresh token available, logout
                        handleLogout();
                    }
                }

                // If not 401 or retry failed, reject the promise
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []); // Run once on mount

    const handleShowLogin = () => { setModalMode('login'); setShowModal(true); };
    const handleShowSignup = () => { setModalMode('signup'); setShowModal(true); };
    const handleCloseModal = () => {
        setShowModal(false);
        // If the user closed the login/signup modal without completing auth,
        // clear any pending request to show the form.
        setShowFormPending(false);
    };

    const handleLoginSuccess = async (data) => {
        localStorage.setItem('authToken', data.access);
        setAuthToken(data.access);
        if (data.refresh) {
            localStorage.setItem('refreshToken', data.refresh);
        }
        handleCloseModal();

        // Fetch fresh user data immediately so we know whether they already submitted
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
            const userResponse = await axios.get(`${API_URL}/user/`);
            setCurrentUser(userResponse.data);

            // If user had pending intent to open the form, show it only when they haven't submitted
            if (showFormPending && !userResponse.data.assessment_submitted) {
                setShowForm(true);
                setShowFormPending(false);
                setTimeout(() => {
                    if (formRef.current) {
                        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            } else {
                // Clear pending in cases where user already submitted
                setShowFormPending(false);
            }
        } catch (err) {
            // If fetching user fails, clear pending and close modal
            setShowFormPending(false);
        }
    };

    const handleFreeTrialClick = () => {
        if (!currentUser) {
            // User not logged in: mark intent and open login modal. Do NOT show the form yet.
            setShowFormPending(true);
            handleShowLogin();
        } else {
            // User already logged in, show form and scroll to it
            setShowForm(true);
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    const handleFormSubmit = () => {
        // Hide form after submission
        setShowForm(false);
        setShowFormPending(false);
        // If user is logged in, find the free trial course they were enrolled in and redirect
        (async () => {
            try {
                if (!currentUser) return;

                // Ensure auth header is present
                if (authToken) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
                }

                // NOTE: We do NOT call /enroll-free-trial/ anymore. 
                // The backend automatically enrolls the user in the correct "Free Trial - Phase X" course
                // when the Google Form submission is processed (submit_assessment view).

                // Refresh current user data so frontend knows they've submitted
                try {
                    const userResponse = await axios.get(`${API_URL}/user/`);
                    setCurrentUser(userResponse.data);
                } catch (e) {
                    // If we couldn't refresh user, still try to proceed
                }

                // Fetch my-courses and look for the dynamically assigned Free Trial course
                let courseId = null;
                try {
                    const myCourses = await axios.get(`${API_URL}/my-courses/`);
                    // find a course that is marked as free trial OR has 'Free Trial' in the title
                    const freeTrialCourse = (myCourses.data || []).find(c =>
                        c.is_free_trial === true ||
                        (c.title || '').toLowerCase().includes('free trial')
                    );
                    if (freeTrialCourse) courseId = freeTrialCourse.id;
                } catch (e) {
                    // ignore
                }

                if (courseId) {
                    // navigate to course home page
                    navigate(`/course/${courseId}`);
                }
            } catch (e) {
                // If anything unexpected fails, attempt to refresh user state once more
                try {
                    const userResponse = await axios.get(`${API_URL}/user/`);
                    setCurrentUser(userResponse.data);
                } catch (er) { }
            }
        })();
    };

    // Poll the user endpoint while the form is open so we detect server-side
    // updates made by the Google Apps Script (which posts directly to backend).
    useEffect(() => {
        if (!showForm || !authToken || !currentUser) return;

        let interval = null;
        const start = Date.now();
        const maxMs = 1000 * 60; // 60s max polling

        const poll = async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
                const resp = await axios.get(`${API_URL}/user/`);
                if (resp.data && resp.data.assessment_submitted) {
                    // The backend has recorded the submission — treat as if form submitted
                    handleFormSubmit();
                    if (interval) clearInterval(interval);
                    return;
                }
            } catch (e) {
                // ignore errors during polling
            }

            if (Date.now() - start > maxMs) {
                if (interval) clearInterval(interval);
            }
        };

        interval = setInterval(poll, 2000);
        // Do a first immediate poll
        poll();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [showForm, authToken, currentUser]);

    const handleLogout = async () => {
        try {
            // Attempt to blacklist token on server
            const refresh = localStorage.getItem('refreshToken');
            if (refresh) {
                // We explicitly DO NOT send the Authorization header here.
                // Why? Because if the Access Token is expired, sending it triggers a 401.
                // That 401 triggers the Interceptor -> Token Refresh -> Rotation.
                // The Rotation invalidates the 'refresh' token we are trying to blacklist here!
                // Result: The old token dies (good), but a NEW token is birth (bad) and stays active.
                // Fix: Call logout anonymously. The view only needs the refresh token body.
                await axios.post(`${API_URL}/logout/`,
                    { refresh: refresh },
                    { headers: { 'Authorization': '' } } // Override header to empty
                );
            }
        } catch (e) {
            console.error("Logout failed on server", e);
        } finally {
            // Always clean up cliend-side
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            delete axios.defaults.headers.common['Authorization'];
            setAuthToken(null);
            setCurrentUser(null);
            // Hide any visible form if the user logs out immediately after login
            setShowForm(false);
            setShowFormPending(false);
            navigate('/');
        }
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
                    <Route path="/" element={
                        <>
                            <HeroSection language={language} />
                            <IntroSection language={language} />
                            <PrinciplesSection language={language} />
                            {/* Replicated Lifelong Mobility section (inserted between Principles and How It Works) */}
                            <AboutSection language={language} />
                            <HowItWorksSection language={language} />
                            <CoursesSection language={language} />
                            {!currentUser?.assessment_submitted && <CtaSection language={language} onFreeTrialClick={handleFreeTrialClick} />}
                            <PainAssessmentSection language={language} showForm={showForm} formRef={formRef} onFormSubmit={handleFormSubmit} currentUser={currentUser} googleFormEntryId={GOOGLE_FORM_ENTRY_IDS[language]} />
                        </>
                    } />

                    <Route
                        path="/course/:courseId"
                        element={<CoursePage user={currentUser} token={authToken} showLogin={handleShowLogin} language={language} />}
                    />

                    <Route path="/player/:courseId/phase/:phaseId" element={
                        <ProtectedRoute user={currentUser} token={authToken}>
                            <VideoPlayerPage language={language} />
                        </ProtectedRoute>
                    } />
                    <Route path="/terms" element={<TermsPage language={language} />} />


                    <Route path="/my-courses" element={
                        <ProtectedRoute user={currentUser} token={authToken}>
                            <MyCoursesPage language={language} />
                        </ProtectedRoute>
                    } />
                    <Route path="/purchase-history" element={
                        <ProtectedRoute user={currentUser} token={authToken}>
                            <PurchaseHistoryPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <SocialMediaSidebar />
        </div>
    );
}