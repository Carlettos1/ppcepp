import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SinPermisos from './SinPermisos';
import useUser from '../User';
const API_IP = process.env.REACT_APP_API_IP;

const CheaterLog = () => {
    const [cheatLogs, setCheatLogs] = useState([]);
    const user = useUser();

    useEffect(() => {
        const interval = setInterval(() => {
            if (parseInt(localStorage.getItem("user_id")) <= 3) { // can see all logs
                axios.get(`${API_IP}/cheat_log/all/named`)
                    .then((response) => {
                        setCheatLogs(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                axios.get(`${API_IP}/cheat_log/teacher/${localStorage.getItem("user_id")}`)
                    .then((response) => {
                        setCheatLogs(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!user?.isAdmin) {
        return <SinPermisos />
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
                        <th>Acción</th>
                        <th>Contexto</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Borrar</th>
                        <th>Estudiante</th>
                        <th>Acción</th>
                        <th>Contexto</th>
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