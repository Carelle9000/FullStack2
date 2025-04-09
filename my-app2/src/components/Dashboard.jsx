import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Créer ce contexte

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authToken } = useContext(AuthContext); // Récupérer le token du contexte

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Envoyer le token dans l'en-tête
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error.response ? error.response.data : error.message);
                setError(error.response?.data?.message || 'Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchUserData();
        } else {
            setError('Not authenticated.');
            setLoading(false);
        }
    }, [authToken]);

    if (loading) {
        return <p>Loading user data...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Dashboard</h2>
            {userData && (
                <div>
                    <p>Welcome, {userData.name}!</p>
                    <p>Email: {userData.email}</p>
                    {/* Afficher d'autres informations de l'utilisateur */}
                </div>
            )}
        </div>
    );
};

export default Dashboard;