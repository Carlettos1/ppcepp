import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import Playground from './components/Playground';
import Intro from './components/Intro';
import QuestionManager from './components/QuestionManager';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Answers from './components/Answers';

const App = () => {
    return (
        <Router>
            <Header/>
            <div class="block"></div>
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-8">
                    <h1 class="title is-1">
                        Proyecto de Plataforma Computacional para Evaluación y Pŕactica de Programaciónaaaaa
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
                    <Route path="/Answers" element={<Answers />} />
                </Routes>
            </div>
        </Router>
    );
};

const Header = () => {
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
            console.error(error);
        });
    }
    , []);
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-menu">
                <div className="navbar-start">
                    <Link to="/" className="navbar-item">Home</Link>
                    <Link to="/test" className="navbar-item">Test</Link>
                    <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                    <Link to="/playground" className="navbar-item">Playground</Link>
                    {admin && (
                        <div class="navbar-item has-dropdown is-hoverable">
                            <a class="navbar-link">Admin</a>
                            <div class="navbar-dropdown">
                                <Link to="/register" className="navbar-item">Register</Link>
                                <Link to="/question-manager" className="navbar-item">Question Manager</Link>
                                <Link to="/Answers" className="navbar-item">Answers</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default App;
