import axios from 'axios';
const API_IP = process.env.REACT_APP_API_IP;

const ExamTimeEntry = ({ teacher_id, name, start_time, end_time }) => {
    const start_time_text = new Date(start_time - new Date().getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 16);
    const end_time_text = new Date(end_time - new Date().getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 16);

    const onChangeStart = (e) => {
        const updated_time = new Date(e.target.value).valueOf();
        axios.patch(`${API_IP}/exam-time/start/${teacher_id}`, { start_time: updated_time });
    };

    const onChangeEnd = (e) => {
        const updated_time = new Date(e.target.value).valueOf();
        axios.patch(`${API_IP}/exam-time/end/${teacher_id}`, { end_time: updated_time });
    };

    return (
        <div class="block">
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-6">
                    <div class="columns">
                        <div class="column">
                            <div class="field">
                                <label class="label">Usuario</label>
                                <div class="control">
                                    {name}
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label class="label">Tiempo Inicio</label>
                                <input class="input" type="datetime-local" defaultValue={start_time_text} onChange={onChangeStart}></input>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label class="label">Tiempo Final</label>
                                <input class="input" type="datetime-local" defaultValue={end_time_text} onChange={onChangeEnd}></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-2"></div>
            </div>
        </div>
    );
};

export default ExamTimeEntry;