import React from 'react';

const Output = ({ output }) => {
  return (
    <div style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
      <strong>Output:</strong>
      <pre>{output}</pre>
    </div>
  );
};

export default Output;
