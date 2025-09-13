import React from 'react';
import { Container, Row, Col, Card, Button, Form, Nav } from 'react-bootstrap';

const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
        const videoUrl = new URL(url);
        return `https://player.vimeo.com/video/${videoUrl.pathname.split('/')[1]}?title=0&byline=0&portrait=0`;
    } catch (e) {
        return "";
    }
};

const CoursePaymentPage = ({ course, onPurchase, isSuperCourse }) => {
    const [selectedCourse, setSelectedCourse] = React.useState(null);
    const [paymentMethod, setPaymentMethod] = React.useState('credit-card');

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
                            <h1>{course.title}</h1>
                            <p className="lead">Start your journey to a pain-free life today.</p>
                            {course.bestseller && <span className="badge bg-warning text-dark me-2">Bestseller</span>}
                            <span>Created by {introVideo?.instructor || 'PhysioFlex Team'}</span>
                        </Col>
                    </Row>
                </Container>
            </header>

            <Container className="py-5">
                <Row>
                    <Col lg={8}>
                        <div className="course-details">
                            <h2>What you'll learn</h2>
                            <ul className="list-unstyled">
                                <li>✔️ Technique 1</li>
                                <li>✔️ Technique 2</li>
                                <li>✔️ Technique 3</li>
                            </ul>
                            <h2>Description</h2>
                            <p>This is a detailed description of the course, explaining the benefits, methods, and expected outcomes for the user.</p>
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
                                <Card.Title as="h2" className="text-center mb-3">₹{selectedCourse?.price}</Card.Title>
                                {isSuperCourse &&
                                    <Form.Group className="mb-3">
                                        <Form.Label>Select Validity</Form.Label>
                                        <Form.Select onChange={handleValidityChange} value={selectedCourse?.id}>
                                            {course.courses.map(subCourse => (
                                                <option key={subCourse.id} value={subCourse.id}>
                                                    {subCourse.validity_weeks} Weeks
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


                                <Button variant="dark" size="lg" className="w-100" onClick={onPurchase}>
                                    Buy Now
                                </Button>
                                <Card.Text className="text-muted text-center mt-2 small">
                                    {selectedCourse?.validity_weeks}-Week Access
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