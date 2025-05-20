import React from 'react';

const Output = ({ output, plotData }) => {
  return (
    <div class="block">
      <strong>Output:</strong>
      <pre>{output}</pre>
      {plotData && (
        <div class="block">
          <strong>Plot:</strong>
          <img 
            src={`data:image/png;base64,${plotData}`} 
            alt="Plot output"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

export default Output;
