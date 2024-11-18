import React from 'react';

interface PromptBoxProps {
  description: string; // The prompt description to display
  onClick: () => void;
}

const PromptBox: React.FC<PromptBoxProps> = ({ description, onClick }) => {
  return (
    <div onClick={onClick} className="prompt-box">
      <p className="prompt-text">{description}</p>
    </div>
  );
};

export default PromptBox;
