import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const CodePlatform = ({test}) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const executeCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/execute", { code });
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error Executing Code: " + error.message);
    }
  }

  return (
    <div class="block">
      <CodeEditor code={code} setCode={setCode} test={test}/>
      <button class="block button is-link" onClick={executeCode}>
        Correr Código
      </button>
      <div class="block">
        <Output output={output}/>
      </div>
    </div>
  );
}

export default CodePlatform;
