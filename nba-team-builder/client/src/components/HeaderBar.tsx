import React from 'react';
import './styles/HeaderBar.css';

interface HeaderBarProps {
  onOpenAuthForm: () => void;
  openProfile: () => void;
  isLoggedIn: boolean;
  username: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onOpenAuthForm, openProfile, isLoggedIn, username}) => {
  return (
    <header className="header-bar">
      <h1>NBA Team Builder</h1>
      <div>
        {isLoggedIn ? (
          <>
            <button className="header-text" onClick={openProfile}>Welcome, {username}</button>
          </>
        ) : (
          <div className="header-buttons">
            <button className="header-text" onClick={onOpenAuthForm}>
              Login/Register
            </button>
          </div>
        )
        }

      </div>
    </header>
  );
};

export default HeaderBar;
