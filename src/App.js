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
import Answers from './components/Answers';
import useVerify from './Verify';
import TeacherQuestionManager from './components/TeacherQuestionManager';
import ExamTime from "./components/ExamTime";
import MassRegister from './components/MassRegister';
import { useState } from 'react';
const API_IP = process.env.REACT_APP_API_IP;
console.log(API_IP);

const App = () => {
    return (
        <Router>
            <Header />
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
                    <Route path="/exam-time" element={<ExamTime />}></Route>
                    <Route path="/mass-register" element={<MassRegister />}></Route>
                </Routes>
            </div>
        </Router>
    );
};

const Header = () => {
    const [isActive, setIsActive] = useState(false);
    const isAdmin = useVerify();
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarData" onClick={(_e) => setIsActive(!isActive)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div id="navbarData" className={"navbar-menu" + (isActive ? "" : " is-active")}>
                <div className="navbar-start">
                    <Link to="/" className="navbar-item">Home</Link>
                    <Link to="/test" className="navbar-item">Prueba</Link>
                    <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                    <Link to="/playground" className="navbar-item">Playground</Link>
                    {isAdmin && (
                        <div class="navbar-item has-dropdown is-hoverable">
                            <div class="navbar-link">Admin</div>
                            <div class="navbar-dropdown">
                                <Link to="/register" className="navbar-item">Registrar</Link>
                                <Link to="/mass-register" className="navbar-item">Registrar en Masa</Link>
                                <Link to="/question-manager" className="navbar-item">Crear Preguntas</Link>
                                <Link to="/teacher-question-manager/:id" className="navbar-item">Asignar Preguntas</Link>
                                <Link to="/Answers" className="navbar-item">Respuestas</Link>
                                <Link to="/cheat_log" className="navbar-item">Cheat Log</Link>
                                <Link to="/exam-time" className="navbar-item">Establecer Tiempos</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default App;
