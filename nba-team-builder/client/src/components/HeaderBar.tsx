import React from 'react';
import './styles/HeaderBar.css';

interface HeaderBarProps {
  onOpenAuthForm: () => void;
  isLoggedIn: boolean;
  username: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onOpenAuthForm , isLoggedIn, username}) => {
  return (
    <header className="header-bar">
      <h1>NBA Team Builder</h1>
      <div className="header-text">
        {isLoggedIn ? (
          <span>Welcome, {username}</span>
        ) : (
          <button className="header-text" onClick={onOpenAuthForm}>
            Login/Register
          </button>
        )
        }

      </div>
    </header>
  );
};

export default HeaderBar;
