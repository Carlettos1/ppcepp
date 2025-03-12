import React from 'react';

const Output = ({ output }) => {
  return (
    <div class="block">
      <strong>Output:</strong>
      <pre>{output}</pre>
    </div>
  );
};

export default Output;
