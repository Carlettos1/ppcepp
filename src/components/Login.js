import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_IP = process.env.REACT_APP_API_IP;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const _username = username.split('@')[0];
            const _password = password.replaceAll(".", "").replaceAll("-", "").replaceAll("k", "K");
            console.log("login...");
            const response = await axios.post(`${API_IP}/auth/login`, { username: _username, password: _password });
            setMessage(response.data.message);

            if (response.data.token) {
                localStorage.clear();
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem("user_name", response.data.user.username);
                localStorage.setItem("user_id", response.data.user.id);
                navigate('/dashboard');
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "An error ocurred");
        }
    };

    return (
        <div>
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-6">
                    <form class="box">
                        <div class="field">
                            <label class="label">Correo</label>
                            <div class="control">
                                <input class="input" type="email" placeholder="e.g. a.bcdefghijk@uandresbello.edu" onChange={(e) => setUsername(e.target.value)}></input>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Rut</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="*********" onChange={(e) => setPassword(e.target.value)}></input>
                            </div>
                        </div>
                        <button class="button is-primary" onClick={handleLogin}>Entrar</button>
                        <div class="block"></div>
                        <strong class="is-5">{message}</strong>
                    </form>
                </div>
                <div class="column is-2"></div>
            </div>
        </div>
    );
};

export default Login;
