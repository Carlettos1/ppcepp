import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
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
    <div className="App">
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Python Code Editor</h1>
        <CodeEditor code={code} setCode={setCode} />
        <button onClick={executeCode} style={{ margin: '10px 0', padding: '10px 20px' }}>
          Run Code
        </button>
        <Output output={output} />
      </div>
    </div>
  );
}

export default App;
