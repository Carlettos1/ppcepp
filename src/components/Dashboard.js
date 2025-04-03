import React from 'react';
import { useNavigate } from 'react-router-dom';
import useVerify from '../Verify';
const API_IP = process.env.REACT_APP_API_IP;

const Dashboard = () => {
    const navigate = useNavigate();
    const isAdmin = useVerify();

    return (
        <div>
            <div class="block"></div>
            <div class="columns">
                <div class="column"></div>
                <div class="column is-4">
                    <button class="button is-link is-fullwidth" onClick={() => navigate('/test')}>
                        Evaluación
                    </button>
                </div>
                <div class="column"></div>
                <div class="column is-4">
                    <button class="button is-link is-fullwidth" onClick={() => navigate('/playground')}>
                        Playground
                    </button>
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

export default Dashboard;
