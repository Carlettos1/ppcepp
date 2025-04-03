import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_IP = process.env.REACT_APP_API_IP;

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [admin, setAdmin] = React.useState(false);
    const [showUsers, setShowUsers] = useState(false);

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
            const _username = username.split('@')[0];
            const _password = password.replaceAll(".", "").replaceAll("-", "").replaceAll("k", "K");
            const response = await axios.post(`${API_IP}/auth/register`, { username: _username, password: _password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "An error ocurred");
        }
    };

    const return_home = async () => {
        navigate("/")
    }

    return (
        <div class="block">
            <div class="columns">
                <div class="column"></div>
                <div class="column is-6">
                    <form class="box">
                        <div class="field">
                            <label class="label">Correo</label>
                            <div class="control">
                                <input class="input" type="rut" placeholder="e.g. a.bcdefghijk@uandresbello.edu" onChange={(e) => setUsername(e.target.value)}></input>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Rut</label>
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
                <div class="column"></div>
            </div>
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    <button class="button is-link" onClick={() => setShowUsers(!showUsers)}>Todos los usuarios</button>
                </div>
                <div class="column"></div>
            </div>
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    { showUsers ? <AllUsers/> : <></> }
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        axios.get(`${API_IP}/user/all`)
        .then((response) => {
            setAllUsers(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    const onDelete = (id) => {
        axios.delete(`${API_IP}/user/${id}`)
        .then((response) => {
            console.log(response.data);
            setAllUsers(prev => [...prev.filter(user => user.id !== id)]);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const onUpgrade = (id) => {
        axios.put(`${API_IP}/user/upgrade/${id}`)
        .then((response) => {
            console.log(response.data);
            setAllUsers(prev => {
                return prev.map(user => {
                    if (user.id === id) {
                        return { ...user, superuser: (Number.parseInt(user.superuser) + 1).toString() };
                    }
                    return user;
                });
            });           
        });
    };

    const onDowngrade = (id) => {
        axios.put(`${API_IP}/user/downgrade/${id}`)
        .then((response) => {
            console.log(response.data);
            setAllUsers(prev => {
                return prev.map(user => {
                    if (user.id === id) {
                        return { ...user, superuser: (Number.parseInt(user.superuser) - 1).toString() };
                    }
                    return user;
                });
            });            
        });
    };

    return (<div class="block">
        <table class="table is-bordered">
            <thead>
                <tr>
                    <th>Borrar</th>
                    <th>Downgrade</th>
                    <th>Upgrade</th>
                    <th>Nombre</th>
                    <th>Superuser</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>Borrar</th>
                    <th>Downgrade</th>
                    <th>Upgrade</th>
                    <th>Nombre</th>
                    <th>Superuser</th>
                </tr>
            </tfoot>
            <tbody>
                {allUsers.map((user) => (
                    <tr key={user.id}>
                        <td class="is-narrow">{user.superuser == "0" ? <button class="button is-danger" onClick={() => onDelete(user.id)}>Delete</button>: <></>}</td>
                        <td class="is-narrow">{user.superuser != "0" ? <button class="button is-warning" onClick={() => onDowngrade(user.id)}>Downgrade</button>: <></>}</td>
                        <td class="is-narrow">{user.superuser != "2" ? <button class="button is-success" onClick={() => onUpgrade(user.id)}>Upgrade</button>: <></>}</td>
                        <td class="is-wide">{user.username}</td>
                        <td class="is-narrow">{user.superuser}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>);
}

export default Register;
