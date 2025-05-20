import React, { useEffect, useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import axios from 'axios';
import './App.css';
const API_IP = process.env.REACT_APP_API_IP;

const CodePlatform = ({test, question_id}) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [plotData, setPlotData] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    try {
      const response = await axios.post(`${API_IP}/execute`, { code, question_id });
      setOutput(response.data.output);
      if (response.data.plot) {
        setPlotData(response.data.plot);
      }
    } catch (error) {
      setOutput("Error Executing Code: " + error.message);
      setPlotData(null);
    }
    
    // Set a 1 second cooldown
    setTimeout(() => {
      setIsExecuting(false);
    }, 1000);
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
      <button 
        class={`block button is-link ${isExecuting ? 'is-loading' : ''}`} 
        onClick={executeCode}
        disabled={isExecuting}
      >
        Correr Código
      </button>
      <div class="block">
        <Output output={output} plotData={plotData}/>
      </div>
    </div>
  );
}

export default CodePlatform;
