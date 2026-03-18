import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SinPermisos from './SinPermisos';
import useUser from '../User';
const API_IP = process.env.REACT_APP_API_IP;

const MassRegister = () => {
    const [excel, setExcel] = useState("");
    const user = useUser();
    useEffect(() => {
        if (!user.isAdmin) {
            return;
        }
        if (user.role !== "2") {
            return;
        }
    }, [user]);

    const parsearYEnviar = (_e) => {
        const users = excel.trim().split("\n").map((line) => parseLine(line));
        const confirmSubmission = window.confirm("Estas seguro de enviar?\nEl profesor/a sería\nrut: " + users[0].rut + "\nemail: " + users[0].email + "\nCon cantidad de alumnos = " + (users.length - 1));
        if (!confirmSubmission) {
            return;
        }
        console.log(users);
        // registrar al profesor (username = correo, superuser = 1, password = rut)
        // obtener su id
        // registrar al resto de la lista, con teacher_id el número de arriba y superuser = 0
        // eso o enviar [{rut, email}] y que el server se haga cargo (mejor, sólo 1 solicitud)
        axios.post(`${API_IP}/auth/mass-register`, {
            users
        },
            {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            }
        ).then((response) => {
            console.log(response);
        });
    };

    if (!user.isAdmin || user.role !== "2") {
        return <SinPermisos />;
    }

    return (
        <div class="block">
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-6">
                    <div class="field">
                        <label class="label">Texto separado por tabs (primera columna es profesor) </label>
                        <textarea class="textarea control" onChange={(e) => setExcel(e.target.value)}></textarea>
                    </div>
                    <button class="button is-link" onClick={parsearYEnviar}>Enviar</button>
                </div>
                <div class="column is-2"></div>
            </div>
        </div>
    );
};

const parseLine = (line) => {
    const segments = line.split("\t");
    let rut;
    let email;

    if (segments[0].includes("@")) {
        rut = segments[1];
        email = segments[0];
    } else if (segments[1].includes("@")) {
        rut = segments[0];
        email = segments[1];
    }

    email = email.split("@")[0];

    return { rut, email };
}

export default MassRegister;