import React from 'react';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

const Playground = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div class="block"></div>
            <Login/>
        </div>
    );
};

export default Playground;
