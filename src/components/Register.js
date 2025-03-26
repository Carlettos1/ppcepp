import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_IP = process.env.REACT_APP_API_IP;

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [admin, setAdmin] = React.useState(false);
    React.useEffect(() => {
        axios.get(`${API_IP}/auth/verify`, {
            headers: {
                Authorization: `${localStorage.getItem('authToken')}`
            }
        })
        .then((response) => {
            if (response.data.role) {
                setAdmin(true);
                console.log("Admin");
            }
            console.log(response.data.message);
        })
        .catch((error) => {
            navigate("/");
        });
    }
    , []);
    if (!admin) {
        return (
            <div>
                <div class="columns">
                    <div class="column"></div>
                    <div class="column is-4">
                        <h1 class="title is-1">No tienes permisos</h1>
                    </div>
                    <div class="column"></div>
                </div>
            </div>
        );
    }

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(`/auth/register`, { username, password });
            // TODO: change ip
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
                                <input class="input" type="rut" placeholder="e.g. 12345678" onChange={(e) => setUsername(e.target.value)}></input>
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
