import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_IP = process.env.REACT_APP_API_IP;

const useVerify = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_IP}/auth/verify`, {
            headers: {
                Authorization: `${localStorage.getItem('authToken')}`
            }
        })
        .then((response) => {
            if (response.data.role) {
                console.log("Admin");
                setIsAdmin(true);
            } else {
                console.log(response.data.message);
            }
        })
        .catch(() => {
            navigate("/");
        });
    }, [navigate]);

    return isAdmin;
};

export default useVerify;
