import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CodeExample from './CodeExample';
import useVerify from '../Verify';
import SinPermisos from './SinPermisos';
const API_IP = process.env.REACT_APP_API_IP;

const Answers = () => {
    const [answers, setAnswers] = useState([]);
    const isAdmin = useVerify();

    useEffect(() => {
        axios.get(`${API_IP}/answer/all/named`)
        .then((response) => {
            setAnswers(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    if (!isAdmin) {
        return (<SinPermisos/>);
    }

    const onDelete = (id) => {
        axios.delete(`${API_IP}/answer/${id}`)
        .then((response) => {
            console.log(response.data);
            setAnswers(prev => [...prev.filter(answer => answer.id !== id)]);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (
        <div class="table-container">
            <table class="table is-bordered is-fullwidth">
                <thead>
                    <tr>
                        <th>Borrar</th>
                        <th>Estudiante</th>
                        <th>Pregunta</th>
                        <th>Respuesta</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Borrar</th>
                        <th>Estudiante</th>
                        <th>Pregunta</th>
                        <th>Respuesta</th>
                    </tr>
                </tfoot>
                <tbody>
                    {answers.map((answer) => (
                        <tr key={answer.id}>
                            <td class="is-narrow"><button class="button is-danger is-small" onClick={() => onDelete(answer.id)}>Borrar</button></td>
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