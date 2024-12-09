import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './styles/HeaderBar.css';

interface HeaderBarProps {
  onOpenAuthForm: () => void;
  openProfile: () => void;
  isLoggedIn: boolean;
  username: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onOpenAuthForm, openProfile, isLoggedIn, username }) => {
  return (
    <header className="header-bar">
      <h1>NBA Team Builder</h1>
      <div>
        {isLoggedIn ? (
          <>
            <button className="header-text" onClick={openProfile}>
              Welcome, {username}
            </button>
            {/* Add Link to Explore Rosters */}
            <Link to="/explore-rosters" className="header-link">
              Explore Rosters
            </Link>
          </>
        ) : (
          <div className="header-buttons">
            <button className="header-text" onClick={onOpenAuthForm}>
              Login/Register
            </button>
            {/* Optionally, add Explore Rosters link for non-logged-in users */}
            <Link to="/explore-rosters" className="header-link">
              Explore Rosters
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default HeaderBar;
