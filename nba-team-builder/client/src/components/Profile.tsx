import React from 'react';
import './styles/Profile.css';

interface ProfileProps {
  onClose: () => void;
  username: string;
  user_id: number;
  onUserUpdate: () => void;
}

const Profile: React.FC<ProfileProps> = ({
  onClose,
  username,
  user_id,
  onUserUpdate,
}) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close modal if the overlay is clicked
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h1>Profile Details</h1>
        <p>
          <strong>Name:</strong> {username}
        </p>
      </div>
    </div>
  );
};

export default Profile;
