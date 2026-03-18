import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div class="block"></div>
            <div class="columns">
                <div class="column"></div>
                <div class="column is-4">
                    <button class="button is-link is-fullwidth" onClick={() => navigate('/test')}>
                        Evaluación
                    </button>
                </div>
                <div class="column"></div>
                <div class="column is-4">
                    <button class="button is-link is-fullwidth" onClick={() => navigate('/playground')}>
                        Playground
                    </button>
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

export default Dashboard;
