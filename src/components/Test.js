import React, { useState } from 'react';
import CodePlatform from '../CodePlatform';
import Question from './Question';
import axios from 'axios';
const API_IP = process.env.REACT_APP_API_IP;

const Test = () => {
    const [submitted, setSubmitted] = useState(false);
    const [progressBarHidden, setProgressBarHidden] = useState(true);

    const onDeliver = async (event) => {
        let editors = document.querySelectorAll(".ace_editor");
        let question_id = 1; // db is 1-indexed
        editors.forEach((editor) => {
            if (editor.id === "practica") {
                console.log(question_id + " - " + editor.childNodes[2].innerText);
                axios.post(`${API_IP}/exam`, {
                    question_id: question_id,
                    answer: editor.childNodes[2].innerText
                }, {
                    headers: {
                        Authorization: `${localStorage.getItem('authToken')}`
                    }
                });
                question_id += 1;
            }
        });
        // disable the submit button
        event.target.disabled = true;
        setProgressBarHidden(false);
        // reload after a second
        setTimeout(() => {
            window.location.reload();
        }, 10000);
    }

    // get all questions
    const [questions, setQuestions] = useState([]);
    React.useEffect(() => {
        axios.get(`${API_IP}/question/all`)
            .then((response) => {
                setQuestions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

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

    if (submitted) {
        return (
            <div class="block">
                <div class="columns">
                    <div class="column"></div>
                    <div class="column is-8">
                        <h class="subtitle is-3">Ya has entregado el examen</h>
                    </div>
                    <div class="column"></div>
                </div>
            </div>
        );
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
                    return <Question example={question.example} question={question.question} title={question.title} test={true}/>;
                })}
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    <button class="button is-danger" onClick={onDeliver}>
                        ENTREGAR
                    </button>
                    <progress class="progress is-primary" max="100" hidden={progressBarHidden}></progress>
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

export default Test;
