import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Nav } from 'react-bootstrap';
import axios from 'axios';
import API_URL from './config/api.js';

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

const getLocalizedContent = (obj, field, language) => {
    if (!obj) return '';
    if (language === 'ta' && obj[`${field}_ta`]) {
        return obj[`${field}_ta`];
    }
    return obj[field] || '';
};

const CoursePaymentPage = ({ course, onPurchase, isSuperCourse, language, user, token }) => {
    const [selectedCourse, setSelectedCourse] = React.useState(null);
    const [paymentMethod, setPaymentMethod] = React.useState('credit-card');
    const [couponCode, setCouponCode] = React.useState('');
    const [couponMessage, setCouponMessage] = React.useState('');
    const [discountData, setDiscountData] = React.useState(null); // { amount, percentage, final_price, valid }
    const t = content[language]; // Translation object

    useEffect(() => {
        if (isSuperCourse && course.courses.length > 0) {
            setSelectedCourse(course.courses[0]);
        } else {
            setSelectedCourse(course);
        }
    }, [course, isSuperCourse]);

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const handleValidityChange = (e) => {
        const courseId = parseInt(e.target.value);
        const newSelectedCourse = course.courses.find(c => c.id === courseId);
        setSelectedCourse(newSelectedCourse);
        // Reset coupon when course changes
        setDiscountData(null);
        setCouponMessage('');
        setCouponCode('');
    };

    const handleApplyCoupon = async () => {
        if (!token) {
            onPurchase(); // Shows login modal
            return;
        }
        if (!couponCode) return;
        setCouponMessage('Validating...');
        try {
            const courseId = selectedCourse ? selectedCourse.id : course.id;
            const res = await axios.post(`${API_URL}/validate-coupon/`,
                { code: couponCode, course_id: courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.valid) {
                const percentage = res.data.discount_percentage;
                const price = parseFloat(selectedCourse ? selectedCourse.price : course.price);
                const discount = (price * percentage) / 100;
                const finalPrice = price - discount;

                setDiscountData({
                    percentage,
                    discount,
                    finalPrice: finalPrice > 0 ? finalPrice : 0,
                    valid: true
                });
                setCouponMessage(`Success! ${percentage}% discount applied.`);
            }
        } catch (error) {
            console.error(error);
            setDiscountData(null);
            setCouponMessage(error.response?.data?.error || 'Invalid Coupon');
        }
    };

    const handleBuyNow = async () => {
        if (!token) {
            onPurchase(); // Shows login modal
            return;
        }

        try {
            const courseId = selectedCourse ? selectedCourse.id : course.id;
            // Create Order
            const orderPayload = { course_id: courseId };
            if (discountData && discountData.valid) {
                orderPayload.coupon_code = couponCode;
            }

            const orderResponse = await axios.post(`${API_URL}/create-order/`,
                orderPayload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Check for 100% discount / immediate success
            if (orderResponse.data.status === 'captured') {
                alert("Enrolled successfully! Redirecting...");
                window.location.reload();
                return;
            }

            const { id: order_id, amount, currency, key_id } = orderResponse.data;



            // Open Razorpay Checkout
            const options = {
                key: key_id,
                amount: amount.toString(),
                currency: currency,
                name: "PhysioFlex", // You might want to make this dynamic or configured
                description: `Purchase ${getLocalizedContent(course, 'title', language)}`,
                // image: "/logo.png", // Add logo if available
                order_id: order_id,
                handler: async function (response) {
                    try {
                        await axios.post(`${API_URL}/verify-payment/`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            course_id: courseId
                        }, { headers: { Authorization: `Bearer ${token}` } });

                        alert("Payment Successful!");
                        window.location.reload(); // Reload to update access
                    } catch (error) {
                        alert("Payment verification failed. Please contact support.");
                        console.error(error);
                    }
                },
                prefill: {
                    name: user ? `${user.first_name} ${user.last_name}` : "",
                    email: user ? user.email : "",
                    contact: ""
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();

        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    const introVideo = isSuperCourse ? course.courses?.[0]?.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0] : course.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0];

    return (
        <div className="course-page-wrapper">
            <header className="course-header-dark py-5">
                <Container>
                    <Row>
                        <Col lg={8} className="text-white">
                            <h1 className="main-heading">{getLocalizedContent(course, 'title', language)}</h1>
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
                            <p>{(isSuperCourse ? getLocalizedContent(course, 'description', language) : getLocalizedContent(course, 'super_course_description', language)) || t.detailedDescription}</p>
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
                                        title={`Intro to ${getLocalizedContent(course, 'title', language)}`}
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

                                <AppCustomCouponInput
                                    couponCode={couponCode}
                                    setCouponCode={setCouponCode}
                                    handleApplyCoupon={handleApplyCoupon}
                                    couponMessage={couponMessage}
                                    discountData={discountData}
                                />
                                {discountData && (
                                    <div className="alert alert-success mt-2 p-2 small">
                                        Original: <span className="text-decoration-line-through">₹{selectedCourse?.price}</span> <br />
                                        New Price: <strong>₹{discountData.finalPrice.toFixed(2)}</strong>
                                    </div>
                                )}

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
                                    {paymentMethod === 'credit-card' && <p>Pay securely with your Credit Card.</p>}
                                    {paymentMethod === 'debit-card' && <p>Pay securely with your Debit Card.</p>}
                                    {paymentMethod === 'upi' && <p>Pay using UPI (GPay, PhonePe, Paytm).</p>}
                                    {paymentMethod === 'net-banking' && <p>Select your bank for Net Banking.</p>}
                                </div>


                                <Button variant="primary" size="lg" className="w-100 header-btn" onClick={handleBuyNow}>
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



const AppCustomCouponInput = ({ couponCode, setCouponCode, handleApplyCoupon, couponMessage, discountData }) => (
    <div className="mb-3">
        <Form.Label>Coupon Code</Form.Label>
        <div className="d-flex gap-2">
            <Form.Control
                type="text"
                placeholder="Enter Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={discountData?.valid}
            />
            <Button variant="outline-primary" onClick={handleApplyCoupon} disabled={discountData?.valid}>
                Apply
            </Button>
        </div>
        {couponMessage && <div className={`small mt-1 ${discountData?.valid ? 'text-success' : 'text-danger'}`}>{couponMessage}</div>}
    </div>
);

export default CoursePaymentPage;
