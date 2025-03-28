import React from 'react';
import CodePlatform from '../CodePlatform';

const Playground = () => {
    return (
        <div class="block">
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    <h1 class="title">Playground</h1>
                    <p class="subtitle is-4">Prueba el código aquí</p>
                    <CodePlatform test={false}/>
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

export default Playground;
