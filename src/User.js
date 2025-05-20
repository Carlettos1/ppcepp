import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_IP = process.env.REACT_APP_API_IP;

const useUser = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_IP}/auth/info`, {
            headers: {
                Authorization: `${localStorage.getItem('authToken')}`
            }
        })
        .then((response) => {
            console.log(response.data);
            setUser(response.data);
        })
        .catch(() => {
            navigate("/");
        });
    }, [navigate]);

    // user is {message, role, id, isAdmin, name}
    return user;
};

export default useUser;
