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
        if (parseInt(localStorage.getItem("user_id")) <= 3) { // can see all answers
            axios.get(`${API_IP}/answer/all/named`)
            .then((response) => {
                setAnswers(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        } else { // can see only their student answers
            axios.get(`${API_IP}/answer/teacher/${localStorage.getItem("user_id")}`)
            .then((response) => {
                setAnswers(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        }
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

    const onGrade = (id, grade) => {
        // remove trailing dot if exists
        if (grade.endsWith('.')) {
            grade = grade.slice(0, -1);
        }
        // trim the grade
        grade = grade.trim();
        // if the grade is empty, set it to null
        if (grade === "") {
            grade = null;
        }
        if (isNaN(grade)) {
            grade = null;
            return;
        }
        if (parseFloat(grade) < 0 || parseFloat(grade) > 10) {
            grade = null;
            return;
        }
        axios.put(`${API_IP}/answer/${id}`, { grade })
        .then((response) => {
            console.log(response.data);
            setAnswers(prev => [...prev.map(answer => answer.id === id ? { ...answer, grade } : answer)]);
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
                        <th>Calificación</th>
                        <th>Respuesta</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Borrar</th>
                        <th>Estudiante</th>
                        <th>Pregunta</th>
                        <th>Calificación</th>
                        <th>Respuesta</th>
                    </tr>
                </tfoot>
                <tbody>
                    {answers.map((answer) => (
                        <tr key={answer.id}>
                            <td class="is-narrow"><button class="button is-danger is-small" onClick={() => onDelete(answer.id)}>Borrar</button></td>
                            <td class="is-narrow">{answer.user_name}</td>
                            <td class="is-narrow">{answer.question ? (answer.question.length > 20 ? answer.question.substring(0, 20) + "..." : answer.question) : "¿?"}</td>
                            <td class="is-narrow"><input class={parseFloat(answer.grade) ? "input is-primary" : "input is-danger"} defaultValue={answer.grade} onChange={(e) => onGrade(answer.id, e.target.value)}></input></td>
                            <td><CodeExample code={answer.answer}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Answers;