import React from 'react';
import './styles/Header.css';

interface HeaderProps {
  onOpenAuthForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuthForm }) => {
  return (
    <header className="header-bar">
      <h1>NBA Team Builder</h1>
      <button className="gear-icon" onClick={onOpenAuthForm}>
        ⚙
      </button>
    </header>
  );
};

export default Header;
