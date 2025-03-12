import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post('http://localhost:5001/auth/register', { username, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "An error ocurred");
        }
    };

    const return_home = async () => {
        navigate("/")
    }

    return (
        <div>
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-6">
                    <form class="box">
                        <div class="field">
                            <label class="label">Rut</label>
                            <div class="control">
                                <input class="input" type="rut" placeholder="e.g. 12.345.678-9" onChange={(e) => setUsername(e.target.value)}></input>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Contraseña</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="*********" onChange={(e) => setPassword(e.target.value)}></input>
                            </div>
                        </div>
                        <button class="button is-primary" onClick={handleRegister}>Registrar</button>
                        <div class="block"></div>
                        <strong class="is-5">{message}</strong>
                    </form>
                    <button class="button is-link" onClick={return_home}>Volver</button>
                </div>
                <div class="column is-2"></div>
            </div>
        </div>
    );
};

export default Register;
