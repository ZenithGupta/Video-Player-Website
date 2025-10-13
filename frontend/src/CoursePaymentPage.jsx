import React from 'react';
import { Container, Row, Col, Card, Button, Form, Nav } from 'react-bootstrap';

// Define content for this component
const content = {
    en: {
        lead: "Start your journey to a pain-free life today.",
        bestseller: "Bestseller",
        createdBy: "Created by",
        whatYouLearn: "What you'll learn",
        description: "Description",
        detailedDescription: "This is a detailed description of the course, explaining the benefits, methods, and expected outcomes for the user.",
        selectValidity: "Select Validity",
        weeks: "Weeks",
        buyNow: "Buy Now",
        access: "Access",
    },
    ta: {
        lead: "வலியற்ற வாழ்க்கையை நோக்கிய உங்கள் பயணத்தை இன்றே தொடங்குங்கள்.",
        bestseller: "மிகவும் விற்பனையாகிறது",
        createdBy: "உருவாக்கியவர்",
        whatYouLearn: "நீங்கள் என்ன கற்றுக்கொள்வீர்கள்",
        description: "விளக்கம்",
        detailedDescription: "இது பாடநெறியின் விரிவான விளக்கமாகும், இது பயனருக்கான நன்மைகள், முறைகள் மற்றும் எதிர்பார்க்கப்படும் விளைவுகளை விளக்குகிறது.",
        selectValidity: "செல்லுபடியாகும் காலத்தைத் தேர்ந்தெடுக்கவும்",
        weeks: "வாரங்கள்",
        buyNow: "இப்போதே வாங்குங்கள்",
        access: "அணுகல்",
    }
}

const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const videoUrl = new URL(url);
        return `https://player.vimeo.com/video/${videoUrl.pathname.split('/')[1]}?title=0&byline=0&portrait=0`;
    } catch (e) {
        return "";
    }
};

const CoursePaymentPage = ({ course, onPurchase, isSuperCourse, language }) => {
    const [selectedCourse, setSelectedCourse] = React.useState(null);
    const [paymentMethod, setPaymentMethod] = React.useState('credit-card');
    const t = content[language]; // Translation object

    React.useEffect(() => {
        if (isSuperCourse && course.courses.length > 0) {
            setSelectedCourse(course.courses[0]);
        } else {
            setSelectedCourse(course);
        }
    }, [course, isSuperCourse]);

    const handleValidityChange = (e) => {
        const courseId = parseInt(e.target.value);
        const newSelectedCourse = course.courses.find(c => c.id === courseId);
        setSelectedCourse(newSelectedCourse);
    };
    
    const introVideo = isSuperCourse ? course.courses?.[0]?.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0] : course.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0];
    
    return (
        <div className="course-page-wrapper">
            <header className="course-header-dark py-5">
                <Container>
                    <Row>
                        <Col lg={8} className="text-white">
                            <h1 className="main-heading">{course.title}</h1>
                            <p className="lead">{t.lead}</p>
                            {course.bestseller && <span className="badge bg-warning text-dark me-2 bestseller-badge">{t.bestseller}</span>}
                            <span>{t.createdBy} {introVideo?.instructor || 'PhysioFlex Team'}</span>
                        </Col>
                    </Row>
                </Container>
            </header>

            <Container className="py-5">
                <Row>
                    <Col lg={8}>
                        <div className="course-details p-4 rounded bg-white shadow-sm">
                            <h2 className="explore-heading">{t.whatYouLearn}</h2>
                            <ul className="list-unstyled">
                                <li>✔️ Personalized recovery plans</li>
                                <li>✔️ Expert guidance from certified physiotherapists</li>
                                <li>✔️ A supportive community to keep you motivated</li>
                            </ul>
                            <h2 className="explore-heading mt-4">{t.description}</h2>
                            <p>{t.detailedDescription}</p>
                        </div>
                    </Col>
                    <Col lg={4}>
                         <Card className="course-action-card sticky-top">
                            {introVideo && (
                                <div className="player-wrapper">
                                    <iframe
                                        className="video-iframe"
                                        src={getEmbedUrl(introVideo.vimeo_url)}
                                        frameBorder="0"
                                        allow="fullscreen"
                                        title={`Intro to ${course.title}`}
                                    ></iframe>
                                </div>
                            )}
                            <Card.Body>
                                <Card.Title as="h2" className="text-center mb-3 course-card-price">₹{selectedCourse?.price}</Card.Title>
                                {isSuperCourse &&
                                    <Form.Group className="mb-3">
                                        <Form.Label className="font-weight-bold">{t.selectValidity}</Form.Label>
                                        <Form.Select onChange={handleValidityChange} value={selectedCourse?.id}>
                                            {course.courses.map(subCourse => (
                                                <option key={subCourse.id} value={subCourse.id}>
                                                    {subCourse.validity_weeks} {t.weeks}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                }

                                <Nav variant="tabs" activeKey={paymentMethod} onSelect={(k) => setPaymentMethod(k)} className="mb-3 payment-methods">
                                    <Nav.Item>
                                        <Nav.Link eventKey="credit-card">Credit Card</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="debit-card">Debit Card</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="upi">UPI</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="net-banking">Net Banking</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <div className="payment-method-content mb-3">
                                    {paymentMethod === 'credit-card' && <p>Credit Card form will be here.</p>}
                                    {paymentMethod === 'debit-card' && <p>Debit Card form will be here.</p>}
                                    {paymentMethod === 'upi' && <p>UPI payment instructions will be here.</p>}
                                    {paymentMethod === 'net-banking' && <p>Net Banking options will be here.</p>}
                                </div>


                                <Button variant="primary" size="lg" className="w-100 header-btn" onClick={onPurchase}>
                                    {t.buyNow}
                                </Button>
                                <Card.Text className="text-muted text-center mt-2 small">
                                    {selectedCourse?.validity_weeks}-{t.weeks} {t.access}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CoursePaymentPage;