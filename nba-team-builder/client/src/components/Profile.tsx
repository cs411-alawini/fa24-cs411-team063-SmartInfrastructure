import React, { useState, useEffect } from 'react';
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
  const [totalTeams, setTotalTeams] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/users/${user_id}/total-teams`);
        if (!response.ok) {
          throw new Error(`Failed to fetch total teams: ${response.statusText}`);
        }
        const data = await response.json();
        setTotalTeams(data.total_teams);
      } catch (err: any) {
        console.error('Error fetching total teams:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalTeams();
  }, [user_id]);

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
        <p>
          <strong>Total Teams:</strong>{' '}
          {loading ? 'Loading...' : error ? <span className="error">{error}</span> : totalTeams}
        </p>
      </div>
    </div>
  );
};

export default Profile;
