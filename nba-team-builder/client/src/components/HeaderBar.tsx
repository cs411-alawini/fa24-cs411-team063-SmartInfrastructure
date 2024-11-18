import React from 'react';
import './styles/HeaderBar.css';

interface HeaderBarProps {
  onOpenAuthForm: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onOpenAuthForm }) => {
  return (
    <header className="header-bar">
      <h1>NBA Team Builder</h1>
      <button className="header-text" onClick={onOpenAuthForm}>
        Login/Register
      </button>
    </header>
  );
};

export default HeaderBar;
