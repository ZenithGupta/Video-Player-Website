import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import API_URL from './config/api.js';

const CourseCard = ({ course }) => {
    const firstVideo = course.phases?.[0]?.weeks?.[0]?.playlist?.videos?.[0];
    return (
         <Link to={`/course/${course.id}`} className="text-decoration-none">
            <div className="course-card h-100">
                <Card className="border-0 h-100 bg-transparent">
                    <Card.Img variant="top" src={firstVideo?.image || 'https://placehold.co/240x135/749BC2/FFFFFF?text=Course'} className="course-card-img" />
                    <Card.Body className="p-3">
                        <Card.Title className="course-card-title text-dark">{course.title}</Card.Title>
                        {/* <Card.Text className="course-card-instructor">{firstVideo?.instructor || 'Dr. Physio'}</Card.Text> */}
                        <p className="course-card-price text-dark">₹{course.price}</p>
                        {course.bestseller && <div className="badge bestseller-badge">Bestseller</div>}
                    </Card.Body>
                </Card>
            </div>
        </Link>
    );
};


const MyCoursesPage = ({ language }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                setLoading(true);
                // Add the lang query parameter to the API call
                const response = await axios.get(`${API_URL}/my-courses/?lang=${language}`);
                setCourses(response.data);
            } catch (err) {
                setError('Could not load your courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, [language]); // Add language to the dependency array

    if (loading) return <Container className="main-content py-5 text-center"><h2 className="main-heading">Loading Your Courses...</h2></Container>;
    if (error) return <Container className="main-content py-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="main-content py-5">
            <h1 className="main-heading mb-4">My Courses</h1>
            {courses.length > 0 ? (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {courses.map(course => (
                        <Col key={course.id}>
                            <CourseCard course={course} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center p-5 bg-light rounded shadow-sm">
                    <p className="sub-heading">You have not enrolled in any courses yet.</p>
                    <Link to="/" className="btn btn-primary header-btn mt-3">Explore Courses</Link>
                </div>
            )}
        </Container>
    );
};

export default MyCoursesPage;