import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Alert } from 'react-bootstrap';
import CourseHomePage from './CourseHomePage.jsx';
import CoursePaymentPage from './CoursePaymentPage.jsx';
import API_URL from './config/api.js';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const CoursePage = ({ user, token, showLogin, language }) => {
    const [course, setCourse] = useState(null);
    const [userCourse, setUserCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { courseId } = useParams();
    const query = useQuery();
    const isSuperCourse = query.get('super') === 'true';

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const url = isSuperCourse ? `${API_URL}/super-courses/${courseId}/?lang=${language}` : `${API_URL}/courses/${courseId}/?lang=${language}`;
                const response = await axios.get(url);
                const courseData = response.data;
                

                if (user) {
                    let enrollment = null;
                    if (isSuperCourse) {
                        const subCourseIds = courseData.courses.map(c => c.id);
                        enrollment = user.usercourse_set.find(uc => subCourseIds.includes(uc.course));
                    } else {
                        enrollment = user.usercourse_set.find(uc => uc.course === parseInt(courseId));
                    }

                    if (enrollment) {
                        const enrolledCourseResponse = await axios.get(`${API_URL}/courses/${enrollment.course}/?lang=${language}`);
                        setCourse(enrolledCourseResponse.data);
                        setUserCourse(enrollment);
                    } else {
                        setCourse(courseData);
                        setUserCourse(null);
                    }
                } else {
                    setCourse(courseData);
                    setUserCourse(null);
                }

            } catch (err) {
                console.error("Error fetching course:", err);
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, user, isSuperCourse, language]);

    const handlePurchase = () => {
        if (!token) {
            showLogin();
        } else {
            alert("Purchase functionality to be implemented!");
        }
    };

    if (loading) return <Container className="main-content py-5 text-center"><h2>Loading...</h2></Container>;
    if (error) return <Container className="main-content py-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!course) return null;
    
    // Pass the language prop down to the child components
    return userCourse ? (
        <CourseHomePage course={course} userCourse={userCourse} language={language} />
    ) : (
        <CoursePaymentPage course={course} onPurchase={handlePurchase} isSuperCourse={isSuperCourse} language={language} />
    );
};

export default CoursePage;