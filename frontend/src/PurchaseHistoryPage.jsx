import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from './config/api';
import { Container, Table, Badge, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PurchaseHistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${API_URL}/purchase-history/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setHistory(response.data);
            } catch (err) {
                console.error("Error fetching purchase history:", err);
                setError("Failed to load purchase history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <Container className="main-content py-5 text-center"><h2 className="main-heading">Loading history...</h2></Container>;
    if (error) return <Container className="main-content py-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="main-content py-5">
            <h1 className="main-heading mb-4">Purchase History</h1>

            {history.length === 0 ? (
                <div className="text-center p-5 bg-light rounded shadow-sm">
                    <p className="sub-heading">You have not purchased any courses yet.</p>
                    <Link to="/" className="btn btn-primary header-btn mt-3">Explore Courses</Link>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <Table striped bordered hover className="mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Date</th>
                                <th>Course</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {new Date(item.purchase_date).toLocaleDateString()}
                                    </td>
                                    <td className="fw-bold">
                                        {item.course_title || 'Unknown Course'}
                                    </td>
                                    <td>
                                        ₹{item.amount}
                                    </td>
                                    <td>
                                        <Badge bg={
                                            item.status === 'SUCCESS' ? 'success' :
                                                item.status === 'FAILED' ? 'danger' :
                                                    'warning'
                                        }>
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="text-muted small font-monospace">
                                        {item.razorpay_order_id}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default PurchaseHistoryPage;
