import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import Playground from './components/Playground';
import Intro from './components/Intro';
import QuestionManager from './components/QuestionManager';
import CheaterLog from "./components/CheaterLog";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Answers from './components/Answers';
import useVerify from './Verify';
import TeacherQuestionManager from './components/TeacherQuestionManager';
const API_IP = process.env.REACT_APP_API_IP;
console.log(API_IP);

const App = () => {
    return (
        <Router>
            <Header/>
            <div class="block"></div>
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-8">
                    <h1 class="title is-1 is-spaced">
                        Plataforma de Evaluación
                    </h1>
                </div>
                <div class="column is-2"></div>
            </div>
            <div class="block"></div>
            <div>
                <Routes>
                    <Route path="/" element={<Intro />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/playground" element={<Playground />} />
                    <Route path="/question-manager" element={<QuestionManager />} />
                    <Route path="/teacher-question-manager/:id" element={<TeacherQuestionManager />} />
                    <Route path="/Answers" element={<Answers />} />
                    <Route path="/cheat_log" element={<CheaterLog />} />
                </Routes>
            </div>
        </Router>
    );
};

const Header = () => {
    const isAdmin = useVerify();
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-menu">
                <div className="navbar-start">
                    <Link to="/" className="navbar-item">Home</Link>
                    <Link to="/test" className="navbar-item">Test</Link>
                    <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                    <Link to="/playground" className="navbar-item">Playground</Link>
                    {isAdmin && (
                        <div class="navbar-item has-dropdown is-hoverable">
                            <a class="navbar-link">Admin</a>
                            <div class="navbar-dropdown">
                                <Link to="/register" className="navbar-item">Register</Link>
                                <Link to="/question-manager" className="navbar-item">Question Manager</Link>
                                <Link to="/teacher-question-manager/:id" className="navbar-item">Teacher Question Manager</Link>
                                <Link to="/Answers" className="navbar-item">Answers</Link>
                                <Link to="/cheat_log" className="navbar-item">Cheat Log</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default App;
