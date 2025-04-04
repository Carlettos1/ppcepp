import React, { useEffect, useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import axios from 'axios';
import './App.css';
const API_IP = process.env.REACT_APP_API_IP;

const CodePlatform = ({test, question_id}) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const executeCode = async () => {
    try {
      const response = await axios.post(`${API_IP}/execute`, { code, question_id });
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error Executing Code: " + error.message);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(`editor-${question_id}`);
    console.log(saved);
    if (saved !== null) {
      setCode(saved);
    }
  }, [question_id]);

  const handleSave = (newValue) => {
    setCode(newValue);
    localStorage.setItem(`editor-${question_id}`, newValue);
  };

  return (
    <div class="block">
      <CodeEditor code={code} setCode={handleSave} test={test} question_id={question_id}/>
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
