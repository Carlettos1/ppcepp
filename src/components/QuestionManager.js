import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/* question architecture:
    id: int
    title: string
    question: string
    example: string
    created_at: timestamp
    updated_at: timestamp
*/

const QuestionManager = () => {
    const [questions, setQuestions] = React.useState([]);
    React.useEffect(() => {
        axios.get('http://localhost:5001/question/all')
            .then((response) => {
                setQuestions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    
    const onSubmit = () => {
        const title = document.querySelector('input[placeholder="Title"]').value;
        const question = document.querySelector('textarea[placeholder="Question"]').value;
        const example = document.querySelector('textarea[placeholder="Example"]').value;
        axios.post('http://localhost:5001/question', {
            title: title,
            question: question,
            example: example
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
        setTimeout(() => {
            window.location.reload();
        }, 200);

    }


    const navigate = useNavigate();
    const [admin, setAdmin] = React.useState(false);
    React.useEffect(() => {
        axios.get("http://localhost:5001/auth/verify", {
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
    
    return (
        <div class="block">
            <div class="columns">
                <div class="column"/>
                <h1 class="title is-4">Question Manager</h1>
                <div class="column"/>
            </div>
            <div class="columns">
                <div class="column"/>
                <div class="box column is-8">
                    <h1 class="title is-5">Create a question</h1>
                    <div class="field">
                        <label class="label">Title</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Title" />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Question</label>
                        <div class="control">
                            <textarea class="textarea" placeholder="Question"></textarea>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Example</label>
                        <div class="control">
                            <textarea class="textarea" placeholder="Example"></textarea>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button class="button is-link" onClick={onSubmit}>Create</button>
                        </div>
                    </div>
                </div>
                <div class="column"/>
            </div>
            <div class="block">
                <ul>
                    {questions.map((question) => {
                        return (
                            <ShowableQuestion title={question.title} question={question.question} example={question.example} id={question.id}/>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

const ShowableQuestion = ({title, question, example, id}) => {
    const [show, setShow] = React.useState(false);
    const onClick = () => {
        setShow(!show);
    }
    const onEdit = () => {
        const title = document.querySelector('textarea[placeholder="Title'+id+'"]').value;
        const question = document.querySelector('textarea[placeholder="Question'+id+'"]').value;
        const example = document.querySelector('textarea[placeholder="Example'+id+'"]').value;
        axios.put('http://localhost:5001/question/' + id, {
            title: title,
            question: question,
            example: example
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }
    const onDelete = () => {
        axios.delete('http://localhost:5001/question/' + id)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
        setTimeout(() => {
            window.location.reload();
        }, 200);
    };
    let reducedTitle = title.length > 20 ? title.substring(0, 20) + "..." : title;
    return (
        <div class="block">
            <div>
                <div class="columns">
                    <div class="column"/>
                    <div class="column is-8">
                        <div class="box">
                            <div class="columns">
                                <div class="column is-1">
                                    <button disabled class="button is-info">{id}</button>
                                </div>
                                <div class="column is-4">
                                    <button class="button is-link" onClick={onClick}>{show ? "Esconder \"" + reducedTitle + "\"" : "Mostrar \"" + reducedTitle + "\""}</button>
                                </div>
                                <div class="column"></div>
                                <div class="column is-2">
                                    <button class="button is-warning" onClick={onEdit}>({id}) Edit</button>
                                </div>
                                <div class="column is-2">
                                    <button class="button is-danger" onClick={onDelete}>({id}) Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column"/>
                </div>
            </div>
            <div>
                {show ? (
                    <EditableQuestion title={title} question={question} example={example} test={false} id={id}/>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

const EditableQuestion = ({title, question, example, id}) => {
    return (    
    <div class="block">
        <div class="columns">
            <div class="column is-2"></div>
            <div class="column is-8">
                <div class="content box">
                    <div class="field">
                        <label class="label">Title</label>
                        <div class="control">
                            <textarea class="input" placeholder={"Title"+id}>{title}</textarea>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Question</label>
                        <div class="control">
                            <textarea class="textarea" placeholder={"Question"+id}>{question}</textarea>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Example</label>
                        <div class="control">
                            <textarea class="textarea" placeholder={"Example"+id}>{example}</textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-2"></div>
        </div>
    </div>
    );
}

export default QuestionManager;