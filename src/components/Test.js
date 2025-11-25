import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CodePlatform from '../CodePlatform';
import Question from './Question';
import useVerify from '../Verify';
import useUser from '../User';
const API_IP = process.env.REACT_APP_API_IP;

const Test = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [received, setReceived] = useState(["Recibidos:"]);
    const lastEventRef = useRef(new Date().getTime());
    const user = useUser();

    // get questions based on user type
    const [questions, setQuestions] = useState([]);
    React.useEffect(() => {
        if (!user?.isAdmin && user?.teacher) {
            // Student - get questions assigned by their teacher
            axios.get(`${API_IP}/question/teacher/${user.teacher}`)
                .then((response) => {
                    setQuestions(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else if (user?.isAdmin) {
            // Admin - get all questions
            axios.get(`${API_IP}/question/all`)
                .then((response) => {
                    setQuestions(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user]);

    const onDeliver = async (event) => {
        const confirmSubmission = window.confirm("¿Estás seguro de que deseas entregar la evaluación?");
        if (!confirmSubmission) {
            return; // Exit if the user cancels
        }
        let editors = document.querySelectorAll(".ace_editor");
        editors.forEach((editor) => {
            if (editor.id === "practica") {
                const question_id = editor.parentElement.attributes[1].value;
                const ace_instance = ace.edit(editor);
                const content = ace_instance.getValue();
                console.log(question_id + " - " + content);
                axios.post(`${API_IP}/exam`, {
                    question_id: question_id,
                    answer: content
                }, {
                    headers: {
                        Authorization: `${localStorage.getItem('authToken')}`
                    }
                }).then((r) => {
                    setReceived(prev => [...prev, question_id]);
                });
            }
        });

        event.target.disabled = true;
        setLoading(true);

        setTimeout(() => {
            window.location.reload();
        }, 10000);
    }

    React.useEffect(() => {
        axios.get(`${API_IP}/exam`, {
            headers: {
                Authorization: `${localStorage.getItem('authToken')}`
            }
        })
        .then((response) => {
            console.log(response.data);
            setSubmitted(response.data.submitted);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            const now = new Date().getTime();
            console.log("User is back on the page: " + ((now - lastEventRef.current) / 1000));
            axios.post(`${API_IP}/cheat_log`, {
                user_id: localStorage.getItem('user_id'),
                action: 0,
                context: "focus vuelto: " + ((now - lastEventRef.current) / 1000) + " segundos",
            });
        };
        const handleBlur = async () => {
            const now = new Date().getTime();
            console.log("Notifying blur");
      
            axios.post(`${API_IP}/cheat_log`, {
                user_id: localStorage.getItem('user_id'),
                action: 0,
                context: "focus perdido",
            });
            lastEventRef.current = now;
        };
      
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);
      
        return () => {
          window.removeEventListener("focus", handleFocus);
          window.removeEventListener("blur", handleBlur);
        };
    }, []);
      

    if (submitted) {
        return (
            <div class="block">
                <div class="columns">
                    <div class="column"></div>
                    <div class="column is-8">
                        <h class="subtitle is-3">Ya has entregado la evaluación</h>
                    </div>
                    <div class="column"></div>
                </div>
            </div>
        );
    }

    if (user?.isAdmin) {
        return <div>Admin</div>
    }

    return (
        <div class="block">
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    <h class="subtitle is-3">Página de Pruebas</h>
                </div>
                <div class="column"></div>
            </div>
            <div class="block"/>
            <hr class="block" style={{"height": "2px"}}/>
            {questions.map((question) => {
                    return <Question example={question.example} question={question.question} title={question.title} test={true} question_id={question.id}/>;
                })}
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    <button class={"button is-large is-danger " + (loading ? "is-loading" : "")} onClick={onDeliver}>
                        ENTREGAR
                    </button>
                    <p>{ received.join(" ") }</p>
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

export default Test;
