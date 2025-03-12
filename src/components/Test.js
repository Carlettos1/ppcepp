import React, { useState } from 'react';
import CodePlatform from '../CodePlatform';
import Question from './Question';

const Test = () => {
    const onDeliver = async (event) => {
        let editors = document.getElementsByName("practica");
        console.log(editors.length)
        for (let i = 0; i < editors.length; i++) {
            const editor = editors[i];
            console.log(typeof editor);
        }
    }

    return (
        <div class="block">
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    <h class="subtitle is-3">Página de Pruebas</h>
                </div>
                <div class="column"></div>
            </div>
            <div class="block"/>
            <hr class="block" style={{"height": "2px"}}/>
            <Question example={"print(\"hola\")\nprint(2)"} question={"Mostrar algo en pantalla"} title={"Basic"} test={true}/>
            <hr class="block" style={{"height": "2px"}}/>
            <Question example={""} question={"Hacer la sucesión de fubonacci"} title={"Fibonacci sequence"} test={true}/>
            <hr class="block" style={{"height": "2px"}}/>
            <div class="columns">
                <div class="column"></div>
                <div class="column is-8">
                    <button class="button is-danger" onClick={onDeliver}>
                        ENTREGAR
                    </button>
                </div>
                <div class="column"></div>
            </div>
        </div>
    );
};

export default Test;
