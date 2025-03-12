import React from 'react';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

const Playground = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div class="block"></div>
            <Login/>
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-6">
                    <button class="button is-link" onClick={async () => {
                        navigate("/register")
                    }}>Register?</button>
                </div>
                <div class="column is-2"></div>
            </div>
        </div>
    );
};

export default Playground;
