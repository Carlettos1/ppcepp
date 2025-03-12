import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Test from './components/Test';
import Playground from './components/Playground';
import Intro from './components/Intro';

const App = () => {
    return (
        <Router>
            <div class="block"></div>
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-8">
                    <h1 class="title is-1">
                        Proyecto de Plataforma Computacional para Evaluación y Pŕactica de Programación
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
                </Routes>
            </div>
        </Router>
    );
};

export default App;
