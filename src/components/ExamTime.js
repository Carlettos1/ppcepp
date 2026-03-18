import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SinPermisos from './SinPermisos';
import useUser from '../User';
import ExamTimeEntry from './ExamTimeEntry';
const API_IP = process.env.REACT_APP_API_IP;

const ExamTime = () => {
    const [examTime, setExamTime] = useState(null);
    const user = useUser();

    useEffect(() => {
        if (!user.isAdmin) {
            return;
        }
        if (user.role === "1") {
            axios.get(`${API_IP}/exam-time/${user.id}`)
                .then((response) => {
                    if (response.data.length === 0) {
                        // doesn't exists in the database, create it.
                        const teacher_id = user.id;
                        const start_time = Date.now();
                        const end_time = start_time + 60 * 60 * 1000;

                        axios.post(`${API_IP}/exam-time/${user.id}`, { start_time, end_time }).then((response) => {
                            console.log(":D");
                        });
                        setExamTime({
                            teacher_id, start_time, end_time
                        });
                    } else {
                        // if exists, just use it bro
                        setExamTime(response.data[0]);
                    }
                });
        } else if (user.role === "2") {
            axios.get(`${API_IP}/exam-time/all`).then((response) => {
                setExamTime(response.data);
            });
        }
    }, [user]);

    if (!user.isAdmin || !examTime) {
        return (<SinPermisos />);
    }

    if (user.role === "1") {
        // Only shows own's exam
        return (<ExamTimeEntry teacher_id={user.id} name={user.name} start_time={examTime.start_time} end_time={examTime.end_time} />);
    }

    return (
        <div>
            {examTime.map(e => (<ExamTimeEntry teacher_id={e.teacher_id} name={e.username} start_time={e.start_time} end_time={e.end_time} />))}
        </div>
    );
};

export default ExamTime;