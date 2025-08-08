import React, { useState, useRef } from 'react';
import { Container, Navbar, Nav, Form, Button, Card, CloseButton, Row, Col } from 'react-bootstrap';

// This imports the styles from your main CSS file.
import './index.css'; 

// --- Language Content ---
const content = {
    en: {
        brand: "PhysioFlex",
        categories: "Categories",
        searchPlaceholder: "Search for anything",
        forBusiness: "For Business",
        teach: "Teach",
        login: "Log In",
        signup: "Sign Up",
        mainHeading: "The One Last Move Program: Move Without Pain",
        intro: "In our daily lives, simple activities like sitting on the floor, using Indian-style toilets, climbing stairs, bending down and getting up, walking long distances, or standing for long periods become difficult for many people. Through our THE ONE LAST MOVE training program, you can perform all these everyday actions effortlessly and pain-free.",
        subHeading: "This program is designed to help you overcome problems such as osteoarthritis, muscle tightness, muscle weakness, and spinal instability, allowing you to do what you love again—without limitations.",
        suffering: "Are you suffering from joint degeneration or osteoarthritis? You're not alone—and surgery is not the only solution.",
        journey: "This program helps restore your movement, kickstart a healthier, happier old age, and regain your confidence in life. I am happy to be part of your joyful journey.",
        question: "How can the One Last Move program help you overcome joint issues and move with ease in daily life?",
        principle1Title: "1. Understanding the Root Cause",
        principle1Text: "The primary reason you still experience pain is the lack of a proper understanding of what’s actually causing it. This program helps you get to the root of your problem and teaches you how to resolve it with the right movements and awareness.",
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
        q1: "1. What is your current level of pain? (0 - No pain, 10 - Severe pain)",
        q2: "2. How is your pain when rising from a seated position?",
        q3: "3. How long can you stand without pain?",
        q4: "4. Can you climb stairs?",
        q5: "5. Do your joints hurt while descending stairs?",
        q6: "6. How far can you walk?",
        q7: "7. Can you fully bend your knees?",
        q8: "8. Can you sit on the floor?",
        q9: "9. Can you stand up from a chair without holding onto anything?",
        q10: "10. Do your joints feel stiff after sitting or standing for a long time?",
        q11: "11. Do you lean or limp while walking?",
        q12: "12. Can you bend down fully?",
        q13: "13. How long can you stand on one leg?"
    },
    ta: {
        brand: "பிசியோஃபிளெக்ஸ்",
        categories: "பிரிவுகள்",
        searchPlaceholder: "எதையும் தேடுங்கள்",
        forBusiness: "வணிகத்திற்காக",
        teach: "கற்பிக்க",
        login: "உள்நுழை",
        signup: "பதிவு செய்க",
        mainHeading: "தி ஒன் லாஸ்ட் மூவ் புரோகிராம்: வலியின்றி நகரவும்",
        intro: "நமது அன்றாட வாழ்வில், தரையில் அமர்வது, இந்திய கழிப்பறைகளைப் பயன்படுத்துவது, மாடிப்படிகளில் ஏறுவது, குனிந்து எழுவது, நீண்ட தூரம் நடப்பது, அல்லது நீண்ட நேரம் நிற்பது போன்ற எளிய நடவடிக்கைகள் பலருக்கு கடினமாகிவிடுகின்றன. எங்களின் 'தி ஒன் லாஸ்ட் மூவ்' பயிற்சித் திட்டத்தின் மூலம், இந்த அனைத்து அன்றாட செயல்களையும் நீங்கள் எளிதாகவும் வலியின்றியும் செய்ய முடியும்.",
        subHeading: "இந்தத் திட்டம் ஆஸ்டியோஆர்த்ரைடிஸ், தசை இறுக்கம், தசை பலவீனம் மற்றும் முதுகெலும்பு உறுதியற்றன்மை போன்ற பிரச்சனைகளைச் சமாளிக்க உதவும் வகையில் வடிவமைக்கப்பட்டுள்ளது, இது நீங்கள் விரும்பியதை மீண்டும் வரம்புகள் இல்லாமல் செய்ய அனுமதிக்கிறது.",
        suffering: "நீங்கள் மூட்டு தேய்மானம் அல்லது கீல்வாதத்தால் பாதிக்கப்படுகிறீர்களா? நீங்கள் தனியாக இல்லை - அறுவை சிகிச்சை மட்டுமே தீர்வு அல்ல.",
        journey: "இந்தத் திட்டம் உங்கள் இயக்கத்தை மீட்டெடுக்கவும், ஆரோக்கியமான, மகிழ்ச்சியான முதுமையைத் தொடங்கவும், வாழ்க்கையில் உங்கள் நம்பிக்கையை மீண்டும் பெறவும் உதவுகிறது. உங்கள் மகிழ்ச்சியான பயணத்தின் ஒரு பகுதியாக இருப்பதில் நான் மகிழ்ச்சியடைகிறேன்.",
        question: "மூட்டுப் பிரச்சனைகளைச் சமாளித்து, அன்றாட வாழ்வில் எளிதாக நடமாட, 'தி ஒன் லாஸ்ட் மூவ்' திட்டம் உங்களுக்கு எப்படி உதவும்?",
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
        q1: "1. உங்கள் தற்போதைய வலி நிலை என்ன? (0 - வலி இல்லை, 10 - கடுமையான வலி)",
        q2: "2. உட்கார்ந்த நிலையில் இருந்து எழும்போது உங்கள் வலி எப்படி இருக்கிறது?",
        q3: "3. வலியின்றி எவ்வளவு நேரம் நிற்க முடியும்?",
        q4: "4. உங்களால் மாடிப்படிகளில் ஏற முடியுமா?",
        q5: "5. மாடிப்படிகளில் இறங்கும்போது உங்கள் மூட்டுகள் வலிக்கிறதா?",
        q6: "6. எவ்வளவு தூரம் நடக்க முடியும்?",
        q7: "7. உங்கள் முழங்கால்களை முழுமையாக மடக்க முடியுமா?",
        q8: "8. உங்களால் தரையில் உட்கார முடியுமா?",
        q9: "9. எதையும் பிடிக்காமல் நாற்காலியில் இருந்து உங்களால் நிற்க முடியுமா?",
        q10: "10. நீண்ட நேரம் உட்கார்ந்த பிறகு அல்லது நின்ற பிறகு உங்கள் மூட்டுகள் விறைப்பாக உணர்கிறதா?",
        q11: "11. நடக்கும்போது நீங்கள் சாய்ந்து அல்லது நொண்டி நடக்கிறீர்களா?",
        q12: "12. உங்களால் முழுமையாக குனிய முடியுமா?",
        q13: "13. ஒரு காலில் எவ்வளவு நேரம் நிற்க முடியும்?"
    }
};


// --- SVG Icons ---
const StarIcon = ({ filled }) => (
    <svg className="star-icon" style={{ color: filled ? '#e59819' : '#d1d7dc' }} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
);
const SearchIcon = () => <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const ChevronLeftIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>;


// --- Mock Data ---
const courseCategories = ["Pain Relief", "Strength Training", "Mobility & Flexibility", "Posture Correction", "Sports Injury"];
const coursesData = [
    { id: 1, title: "The Complete Guide to Knee Pain Relief", instructor: "Dr. Eva Rostova", rating: 4.8, reviews: 1987, price: "2,799", image: "https://placehold.co/240x135/749BC2/FFFFFF?text=Knee+Pain", bestseller: true },
    { id: 2, title: "Yoga for a Healthy Back: 21 Day Program", instructor: "Dr. Ben Carter", rating: 4.9, reviews: 4812, price: "3,199", image: "https://placehold.co/240x135/4682A9/FFFFFF?text=Yoga", premium: true },
    { id: 3, title: "Core Strength Masterclass for Beginners", instructor: "Dr. Frank Miller", rating: 4.8, reviews: 3105, price: "899", image: "https://placehold.co/240x135/91C8E4/FFFFFF?text=Core", premium: true },
    { id: 4, title: "Full Body Home Workout: No Equipment", instructor: "Dr. Chloe Davis", rating: 4.6, reviews: 1890, price: "799", image: "https://placehold.co/240x135/749BC2/FFFFFF?text=Workout" },
    { id: 5, title: "Ultimate Flexibility Guide: Unlock Your Body", instructor: "Dr. Angela Wyatt", rating: 4.7, reviews: 1523, price: "1,299", image: "https://placehold.co/240x135/4682A9/FFFFFF?text=Flexibility" },
];


// --- Components ---
const Header = ({ language, setLanguage }) => {
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ta' : 'en');
    };

    return (
        <Navbar bg="white" expand="lg" className="app-header shadow-sm sticky-top">
            <Container fluid="xl">
                <Navbar.Brand href="#" className="header-brand">{content[language].brand}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="mobile-nav-bg">
                    <Nav className="me-auto">
                        <Nav.Link href="#" className="header-nav-link">{content[language].categories}</Nav.Link>
                        <Nav.Link href="#" className="header-nav-link">{content[language].forBusiness}</Nav.Link>
                        <Nav.Link href="#" className="header-nav-link">{content[language].teach}</Nav.Link>
                    </Nav>
                    <Form className="d-flex flex-grow-1 my-2 my-lg-0 mx-lg-4">
                        <div className="search-wrapper">
                            <span className="search-icon-wrapper"><SearchIcon /></span>
                            <Form.Control type="search" placeholder={content[language].searchPlaceholder} className="search-input" />
                        </div>
                    </Form>
                    <Nav className="align-items-center">
                        <Button variant="outline-dark" className="header-btn mx-2 my-1 my-lg-0" onClick={toggleLanguage}>
                            {language === 'en' ? 'தமிழ்' : 'English'}
                        </Button>
                        <Button variant="outline-dark" className="header-btn my-1 my-lg-0">{content[language].login}</Button>
                        <Button variant="dark" className="header-btn ms-lg-2 my-1 my-lg-0">{content[language].signup}</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

const CourseCard = ({ course, onCourseSelect }) => (
    <div className="course-card" onClick={() => onCourseSelect(course)}>
        <Card className="border-0 h-100 bg-transparent">
            <Card.Img variant="top" src={course.image} className="course-card-img" />
            <Card.Body className="p-0 pt-2">
                <Card.Title className="course-card-title">{course.title}</Card.Title>
                <Card.Text className="course-card-instructor">{course.instructor}</Card.Text>
                <div className="d-flex align-items-center">
                    <span className="course-card-rating">{course.rating.toFixed(1)}</span>
                    <div className="d-flex me-1"><StarIcon filled /><StarIcon filled /><StarIcon filled /><StarIcon filled /><StarIcon /></div>
                    <span className="course-card-reviews">({course.reviews.toLocaleString()})</span>
                </div>
                <p className="course-card-price">₹{course.price}</p>
                {course.bestseller && <div className="badge bestseller-badge">Bestseller</div>}
            </Card.Body>
        </Card>
    </div>
);

const VideoPlayerSection = ({ course, onClose }) => (
    <div className="video-player-section">
        <div className="video-player-header">
            <h5 className="video-player-title">{course.title}</h5>
            <CloseButton onClick={onClose} />
        </div>
        <div className='player-wrapper'>
            <iframe
                className='video-iframe'
                src="https://drive.google.com/file/d/1SxiONEHGu-8NfkFxh0ri9K5z90aqzoNzjg/preview"
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen>
            </iframe>
        </div>
    </div>
);

const IntroSection = ({ language }) => (
    <Container fluid="xl" className="py-5 text-center">
        <h1 className="main-heading">{content[language].mainHeading}</h1>
        <p className="sub-heading mx-auto" style={{ maxWidth: '800px' }}>{content[language].intro}</p>
        <p className="lead mx-auto" style={{ maxWidth: '800px' }}>{content[language].subHeading}</p>
        <p className="fw-bold mt-3">{content[language].suffering}</p>
        <p className="lead mx-auto mt-3" style={{ maxWidth: '800px' }}>{content[language].journey}</p>
        <p className="sub-heading mx-auto" style={{ maxWidth: '800px' }}>{content[language].question}</p>
    </Container>
);

const PrinciplesSection = ({ language }) => (
    <Container fluid="xl" className="py-5 bg-light">
        <Row>
            <Col md={4}>
                <h4>{content[language].principle1Title}</h4>
                <p>{content[language].principle1Text}</p>
            </Col>
            <Col md={4}>
                <h4>{content[language].principle2Title}</h4>
                <p>{content[language].principle2Text}</p>
            </Col>
            <Col md={4}>
                <h4>{content[language].principle3Title}</h4>
                <p>{content[language].principle3Text}</p>
            </Col>
        </Row>
    </Container>
);

const HowItWorksSection = ({ language }) => (
     <Container fluid="xl" className="py-5">
        <h2 className="text-center main-heading mb-4">{content[language].howItWorksTitle}</h2>
        <Row className="text-center">
            <Col md={3}><strong>Step 1:</strong> {content[language].howItWorksStep1}</Col>
            <Col md={3}><strong>Step 2:</strong> {content[language].howItWorksStep2}</Col>
            <Col md={3}><strong>Step 3:</strong> {content[language].howItWorksStep3}</Col>
            <Col md={3}><strong>Step 4:</strong> {content[language].howItWorksStep4}</Col>
        </Row>
    </Container>
);

const PainAssessmentSection = ({ language }) => (
    <Container fluid="xl" className="py-5">
        <h2 className="text-center main-heading mb-4">{content[language].assessmentTitle}</h2>
        <p className="text-center sub-heading mx-auto" style={{ maxWidth: '800px' }}>{content[language].assessmentIntro}</p>
        <Row className="justify-content-center">
            <Col md={8}>
                <ul className="list-unstyled">
                    <li className="mt-3">{content[language].q1}</li>
                    <li className="mt-3">{content[language].q2}</li>
                    <li className="mt-3">{content[language].q3}</li>
                    <li className="mt-3">{content[language].q4}</li>
                    <li className="mt-3">{content[language].q5}</li>
                    <li className="mt-3">{content[language].q6}</li>
                    <li className="mt-3">{content[language].q7}</li>
                    <li className="mt-3">{content[language].q8}</li>
                    <li className="mt-3">{content[language].q9}</li>
                    <li className="mt-3">{content[language].q10}</li>
                    <li className="mt-3">{content[language].q11}</li>
                    <li className="mt-3">{content[language].q12}</li>
                    <li className="mt-3">{content[language].q13}</li>
                </ul>
            </Col>
        </Row>
    </Container>
);

const CtaSection = ({ language }) => (
    <Container fluid="xl" className="py-5 text-center bg-light">
        <h3>{content[language].reclaimLifeTitle}</h3>
        <p className="lead mx-auto" style={{ maxWidth: '700px' }}>{content[language].reclaimLifeText}</p>
        <h4 className="mt-4">{content[language].ctaTitle}</h4>
        <p>{content[language].ctaText}</p>
        <Button variant="dark" size="lg" className="header-btn mt-2">{content[language].ctaButton}</Button>
    </Container>
);


const CoursesSection = ({ onCourseSelect, language }) => {
    const [activeTab, setActiveTab] = useState(courseCategories[0]);
    const scrollContainerRef = useRef(null);
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
                {courseCategories.map(category => (
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
                        {coursesData.map(course => <CourseCard key={course.id} course={course} onCourseSelect={onCourseSelect} />)}
                    </div>
                   <Button onClick={() => scroll('right')} variant="light" className="scroll-btn scroll-btn-right"><ChevronRightIcon/></Button>
                </div>
            </div>
        </Container>
    );
};

export default function App() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [language, setLanguage] = useState('en');

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClosePlayer = () => {
        setSelectedCourse(null);
    };

    return (
        <div className="app-container">
            <Header language={language} setLanguage={setLanguage} />
            <main>
                {selectedCourse && <VideoPlayerSection key={selectedCourse.id} course={selectedCourse} onClose={handleClosePlayer} />}
                <IntroSection language={language} />
                <PrinciplesSection language={language} />
                <HowItWorksSection language={language} />
                <CoursesSection onCourseSelect={handleCourseSelect} language={language} />
                <CtaSection language={language} />
                <PainAssessmentSection language={language} />
            </main>
        </div>
    );
}
