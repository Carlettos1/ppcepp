import React from 'react';
import { useNavigate } from 'react-router-dom';

const SinPermisos = () => {
    const navigate = useNavigate();

    return (
        <div class="block">
            <div class="columns">
                <div class="column"></div>
                <div class="column is-4">
                    <h1 class="title is-1">No tienes permisos</h1>
                </div>
                <div class="column"></div>
            </div>
            <div class="columns">
                <div class="column"></div>
                <div class="column is-4">
                    <button class="button is-primary" onClick={() => navigate('/dashboard')}>Volver</button>
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

export default SinPermisos;
