import axios from 'axios';
import React, { useState } from 'react';

const SubmitLeaveRequest = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                'http://127.0.0.1:8000/api/leave_request/',
                { start_date: startDate, end_date: endDate, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Demande de congé envoyée avec succès !");
        } catch (error) {
            console.error("Erreur lors de la demande de congé:", error);
            setMessage("Échec de la demande de congé.");
        }
    };

    return (
        <div>
            <h2>Demande de congé</h2>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motif du congé"></textarea>
            <button onClick={handleSubmit}>Envoyer la demande</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SubmitLeaveRequest;
