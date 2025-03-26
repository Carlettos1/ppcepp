import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const API_IP = process.env.REACT_APP_API_IP;

const Dashboard = () => {
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
            navigate('/');
        });
    }
    , []);

    return (
        <div>
            <div class="block"></div>
            <div class="columns">
                <div class="column"></div>
                <div class="column is-4">
                    <figure class="image button is-link" onClick={() => navigate('/test')}>
                        <img alt="Test" src="https://cdn-icons-png.flaticon.com/512/1946/1946058.png"></img>
                    </figure>
                </div>
                <div class="column"></div>
                <div class="column is-4">
                    <figure class="image button is-link" onClick={() => navigate('/playground')}>
                        <img alt="Playground" src="https://as2.ftcdn.net/jpg/05/03/28/01/1000_F_503280113_MZRPtkiA7ghUEb6mRkii1MA5wRpsxy2W.jpg"></img>
                    </figure>
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

export default Dashboard;
