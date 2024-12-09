// src/components/ExploreRosters.tsx
import React, { useEffect, useState } from 'react';
import './styles/ExploreRosters.css';
import { Roster, RosterResponse } from '../types/Roster'; // Import shared types

interface ExploreRostersProps {
  onSelectRoster: (roster: Roster) => void;
  onDeleteRoster: (roster_id: number) => void;
}

const ExploreRosters: React.FC<ExploreRostersProps> = ({ onSelectRoster, onDeleteRoster }) => {
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    const fetchRosters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/explore-rosters?page=${currentPage}&limit=${limit}`);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch rosters');
          return;
        }
        const data: RosterResponse = await response.json();
        setRosters(data.rosters);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching rosters.');
      } finally {
        setLoading(false);
      }
    };

    fetchRosters();
  }, [currentPage]);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const handleDelete = async (roster_id: number) => {
    if (window.confirm('Are you sure you want to delete this roster?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/rosters/${roster_id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
          // Remove the deleted roster from the state
          setRosters(prevRosters => prevRosters.filter(roster => roster.roster_id !== roster_id));
          onDeleteRoster(roster_id);
        } else {
          setError(data.error || 'Failed to delete roster.');
        }
      } catch (error) {
        console.error('Error deleting roster:', error);
        setError('An unexpected error occurred while deleting the roster.');
      }
    }
  };

  return (
    <div className="explore-rosters-container">
      <h1>Explore Rosters</h1>
      {loading && <p>Loading rosters...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && rosters.length > 0 && (
        <>
          <div className="rosters-list">
            {rosters.map((roster) => (
              <div key={roster.roster_id} className="roster-card">
                <h2>Roster #{roster.roster_id}</h2>
                <p><strong>Username:</strong> {roster.username || 'Guest'}</p>
                <p><strong>Prompt ID:</strong> {roster.prompt_id ?? 'N/A'}</p>
                <p><strong>Total Salary:</strong> ${roster.total_salary.toLocaleString()}</p>
                <p><strong>Total Penalty:</strong> ${roster.total_penalty.toLocaleString()}</p>
                <h3>Players:</h3>
                <ul>
                  {roster.players.map((player) => (
                    <li key={player.player_id}>
                      {player.first_name} {player.last_name} - {player.team_name} - Salary: ${player.salary.toLocaleString()}
                    </li>
                  ))}
                </ul>
                <div className="roster-actions">
                  <button onClick={() => onSelectRoster(roster)}>Use This Roster</button>
                  <button className="delete-button" onClick={() => handleDelete(roster.roster_id)}>Delete Roster</button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
      {!loading && !error && rosters.length === 0 && (
        <p>No rosters available to display.</p>
      )}
    </div>
  );
};

export default ExploreRosters;
