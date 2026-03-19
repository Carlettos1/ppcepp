import React from 'react';
import axios from 'axios';
import SinPermisos from './SinPermisos';
import useUser from '../User';
const API_IP = process.env.REACT_APP_API_IP;

const TeacherQuestionManager = () => {
    const [assignments, setAssignments] = React.useState([]);
    const [allQuestions, setAllQuestions] = React.useState([]);
    const user = useUser();
    const isAdmin = user && user.isAdmin;

    // Get current assignments
    React.useEffect(() => {
        if (!isAdmin) return;

        axios.get(`${API_IP}/question/teacher/${user.id}`)
            .then((response) => {
                setAssignments(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [user, isAdmin]);

    // Get all questions
    React.useEffect(() => {
        axios.get(`${API_IP}/question/all`)
            .then((response) => {
                setAllQuestions(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Filter out assigned questions from available questions
    const availableQuestions = allQuestions.filter(
        question => !assignments.some(assigned => assigned.id === question.id)
    );

    const onAssign = (questionId) => {
        axios.post(`${API_IP}/teacher-question`, {
            teacher_id: user.id,
            question_id: questionId
        })
            .then((response) => {
                // Add to assignments
                const question = allQuestions.find(q => q.id === questionId);
                setAssignments(prev => [...prev, question]);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const onUnassign = (questionId) => {
        axios.delete(`${API_IP}/teacher-question/${user.id}/${questionId}`)
            .then((response) => {
                // Remove from assignments
                setAssignments(prev => prev.filter(q => q.id !== questionId));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    if (!user?.isAdmin) {
        return <SinPermisos />
    }

    return (
        <div className="block">
            <div className="columns">
                <div className="column" />
                <h1 className="title is-4">Question Assignment Manager</h1>
                <div className="column" />
            </div>

            {/* Assigned Questions */}
            <div className="columns">
                <div className="column" />
                <div className="box column is-8">
                    <h2 className="title is-5">Assigned Questions</h2>
                    <div className="table-container">
                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map((question) => (
                                    <tr key={question.id}>
                                        <td>{question.id}</td>
                                        <td>{question.title}</td>
                                        <td>
                                            <button
                                                className="button is-danger is-small"
                                                onClick={() => onUnassign(question.id)}
                                            >
                                                Unassign
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="column" />
            </div>

            {/* Available Questions */}
            <div className="columns">
                <div className="column" />
                <div className="box column is-8">
                    <h2 className="title is-5">Available Questions</h2>
                    <div className="table-container">
                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableQuestions.map((question) => (
                                    <tr key={question.id}>
                                        <td>{question.id}</td>
                                        <td>{question.title}</td>
                                        <td>
                                            <button
                                                className="button is-success is-small"
                                                onClick={() => onAssign(question.id)}
                                            >
                                                Assign
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="column" />
            </div>
        </div>
    );
};

export default TeacherQuestionManager; 