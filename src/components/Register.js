import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SinPermisos from './SinPermisos';
import useUser from '../User';
const API_IP = process.env.REACT_APP_API_IP;

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const user = useUser();
    const [showUsers, setShowUsers] = useState(false);
    const [showMyStudents, setShowMyStudents] = useState(false);

    if (!user?.isAdmin) {
        return <SinPermisos/>
    }

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            const _username = username.split('@')[0];
            const _password = password.replaceAll(".", "").replaceAll("-", "").replaceAll("k", "K");
            const response = await axios.post(`${API_IP}/auth/register`, { 
                username: _username, 
                password: _password,
                teacher_id: user.id  // Add the admin's ID as teacher_id
            });
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
                    <div class="buttons">
                        <button class="button is-link" onClick={() => {
                            setShowUsers(!showUsers);
                            setShowMyStudents(false);
                        }}>Todos los usuarios</button>
                        <button class="button is-info" onClick={() => {
                            setShowMyStudents(!showMyStudents);
                            setShowUsers(false);
                        }}>Mis estudiantes</button>
                    </div>
                </div>
                <div class="column"></div>
            </div>
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    { showUsers ? <AllUsers/> : <></> }
                    { showMyStudents ? <MyStudents teacherId={user.id}/> : <></> }
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [teacherIdInput, setTeacherIdInput] = useState('');
    const user = useUser();

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

    const onTeacherEdit = (id) => {
        setEditingTeacher(id);
        const user = allUsers.find(u => u.id === id);
        setTeacherIdInput(user.teacher_id || '');
    };

    const onTeacherSave = (id) => {
        axios.put(`${API_IP}/user/teacher/${id}`, { teacher_id: teacherIdInput })
        .then((response) => {
            console.log(response.data);
            setAllUsers(prev => {
                return prev.map(user => {
                    if (user.id === id) {
                        return { ...user, teacher_id: teacherIdInput };
                    }
                    return user;
                });
            });
            setEditingTeacher(null);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const onClaim = (id) => {
        axios.put(`${API_IP}/user/teacher/${id}`, { teacher_id: user.id })
        .then((response) => {
            console.log(response.data);
            setAllUsers(prev => {
                return prev.map(prevUser => {
                    if (prevUser.id === id) {
                        return { ...prevUser, teacher_id: user.id };
                    }
                    return prevUser;
                });
            });
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (<div class="block">
        <table class="table is-bordered">
            <thead>
                <tr>
                    <th>Borrar</th>
                    <th>Permisos</th>
                    <th>Claim</th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Superuser</th>
                    <th>Teacher ID</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>Borrar</th>
                    <th>Permisos</th>
                    <th>Claim</th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Superuser</th>
                    <th>Teacher ID</th>
                </tr>
            </tfoot>
            <tbody>
                {allUsers.map((user) => (
                    <tr key={user.id}>
                        <td class="is-narrow">{user.superuser == "0" ? <button class="button is-danger" onClick={() => onDelete(user.id)}>Delete</button>: <></>}</td>
                        <td class="is-narrow">
                            <div class="field has-addons">
                                {user.superuser != "0" ? 
                                    <div class="control">
                                        <button class="button is-small is-warning" onClick={() => onDowngrade(user.id)}>Down</button>
                                    </div>
                                : <></>}
                                {user.superuser != "2" ? 
                                    <div class="control">
                                        <button class="button is-small is-success" onClick={() => onUpgrade(user.id)}>Up</button>
                                    </div>
                                : <></>}
                            </div>
                        </td>
                        <td class="is-narrow">{user.teacher_id !== user.id ? <button class="button is-info" onClick={() => onClaim(user.id)}>Claim</button>: <></>}</td>
                        <td class="is-narrow">{user.id}</td>
                        <td class="is-wide">{user.username}</td>
                        <td class="is-narrow">{user.superuser}</td>
                        <td class="is-narrow">
                            {editingTeacher === user.id ? (
                                <div class="field has-addons">
                                    <div class="control">
                                        <input 
                                            class="input is-small" 
                                            type="number" 
                                            style={{ width: '100px' }}
                                            value={teacherIdInput}
                                            onChange={(e) => setTeacherIdInput(e.target.value)}
                                        />
                                    </div>
                                    <div class="control">
                                        <button 
                                            class="button is-small is-success"
                                            onClick={() => onTeacherSave(user.id)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div class="field has-addons">
                                    <div class="control">
                                        <input 
                                            class="input is-small" 
                                            type="text" 
                                            style={{ width: '100px' }}
                                            value={user.teacher_id || ''} 
                                            disabled 
                                        />
                                    </div>
                                    <div class="control">
                                        <button 
                                            class="button is-small is-info"
                                            onClick={() => onTeacherEdit(user.id)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>);
}

const MyStudents = ({ teacherId }) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get(`${API_IP}/user/teacher/${teacherId}`)
            .then((response) => {
            setStudents(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [teacherId]);

    const onDelete = (id) => {
        axios.put(`${API_IP}/user/remove-teacher/${id}`)
        .then((response) => {
            console.log(response.data);
            setStudents(prev => [...prev.filter(user => user.id !== id)]);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (<div class="block">
        <table class="table is-bordered">
            <thead>
                <tr>
                    <th>Borrar</th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Superuser</th>
                    <th>Teacher ID</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>Borrar</th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Superuser</th>
                    <th>Teacher ID</th>
                </tr>
            </tfoot>
            <tbody>
                {students.map((user) => (
                    <tr key={user.id}>
                        <td class="is-narrow">
                            <button class="button is-danger" onClick={() => onDelete(user.id)}>Delete</button>
                        </td>
                        <td class="is-narrow">{user.id}</td>
                        <td class="is-wide">{user.username}</td>
                        <td class="is-narrow">{user.superuser}</td>
                        <td class="is-narrow">{user.teacher_id}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>);
}

export default Register;
