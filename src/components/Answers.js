import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeExample from './CodeExample';
const API_IP = process.env.REACT_APP_API_IP;

const Answers = () => {
    const [answers, setAnswers] = useState([]);
    const [admin, setAdmin] = React.useState(false);
    const navigate = useNavigate();

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

                axios.get(`${API_IP}/answer/all/named`)
                .then((response) => {
                    setAnswers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
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

    return (
        <div class="table-container">
            <table class="table is-bordered is-fullwidth">
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th>Pregunta</th>
                        <th>Respuesta</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Estudiante</th>
                        <th>Pregunta</th>
                        <th>Respuesta</th>
                    </tr>
                </tfoot>
                <tbody>
                    {answers.map((answer) => (
                        <tr key={answer.id}>
                            <td class="is-narrow">{answer.user_name}</td>
                            <td class="is-narrow">{answer.question.length > 20 ? answer.question.substring(0, 20) + "..." : answer.question}</td>
                            <td><CodeExample code={answer.answer}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Answers;