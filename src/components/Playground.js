import React from 'react';
import CodePlatform from '../CodePlatform';

const Playground = () => {
    return (
        <div class="block">
            <h2>Playground</h2>
            <p>This is the playground page. Implement your playground functionality here.</p>
            <CodePlatform test={false}/>
        </div>
    );
};

export default Playground;
