import React from 'react';

interface PromptBoxProps {
  description: string; // The prompt description to display
}

const PromptBox: React.FC<PromptBoxProps> = ({ description }) => {
  return (
    <div className="prompt-box">
      <p className="prompt-text">{description}</p>
    </div>
  );
};

export default PromptBox;
