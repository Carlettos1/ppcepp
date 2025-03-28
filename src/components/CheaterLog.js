import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useVerify from '../Verify';
import SinPermisos from './SinPermisos';
const API_IP = process.env.REACT_APP_API_IP;

const CheaterLog = () => {
    const [cheatLogs, setCheatLogs] = useState([]);
    const isAdmin = useVerify();

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`${API_IP}/cheat_log/all/named`)
            .then((response) => {
                setCheatLogs(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    if (!isAdmin) {
        return (<SinPermisos/>);
    }

    const onDelete = (id) => {
        axios.delete(`${API_IP}/cheat_log/${id}`)
        .then((response) => {
            console.log(response.data);
            setCheatLogs(prev => [...prev.filter(log => log.id !== id)])
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
                        <th>Respuesta</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Borrar</th>
                        <th>Estudiante</th>
                        <th>Pregunta</th>
                        <th>Respuesta</th>
                    </tr>
                </tfoot>
                <tbody>
                    {cheatLogs.map((cheatLog) => (
                        <tr key={cheatLog.id}>
                            <td class="is-narrow"><button class="button is-danger is-small" onClick={() => onDelete(cheatLog.id)}>Borrar</button></td>
                            <td class="is-narrow">{cheatLog.user_name}</td>
                            <td class="is-narrow">{cheatLog.action}</td>
                            <td>{cheatLog.context}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CheaterLog;