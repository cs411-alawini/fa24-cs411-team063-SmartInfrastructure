// src/components/EditRoster.tsx

import React, { useState, useEffect } from 'react';
import './styles/EditRoster.css';
import { Player, Roster } from '../types/Roster'; // Assuming you have these types defined
import SearchBar from './SearchBar'; // Reuse the SearchBar component for player selection

interface EditRosterProps {
  roster: Roster;
  onUpdate: () => void; // Callback to refresh data after update
  onClose: () => void; // Function to close the edit modal
  user_id: number | null;
}

const EditRoster: React.FC<EditRosterProps> = ({ roster, onUpdate, onClose, user_id }) => {
  const [promptId, setPromptId] = useState(roster.prompt_id);
  const [players, setPlayers] = useState<Player[]>(roster.players); // Assuming roster.players is an array of Player objects
  const [totalSalary, setTotalSalary] = useState<number>(roster.total_salary);
  const [totalPenalty, setTotalPenalty] = useState<number>(roster.total_penalty);
  const [message, setMessage] = useState<string | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]); // Players to select from

  // Fetch available players for selection (assuming an API endpoint exists)
  useEffect(() => {
    const fetchAvailablePlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players'); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch players.');
        }
        const data: Player[] = await response.json();
        // Exclude already selected players to prevent duplicates
        const filteredPlayers = data.filter(
          (player) => !players.some((p) => p.player_id === player.player_id)
        );
        setAvailablePlayers(filteredPlayers);
      } catch (error) {
        console.error('Error fetching players:', error);
        setMessage('Failed to load players. Please try again later.');
      }
    };

    fetchAvailablePlayers();
  }, [players]);

  const handleAddPlayer = (player: Player) => {
    if (players.length >= 5) {
      setMessage('Roster can only contain 5 players.');
      return;
    }
    if (players.find((p) => p.player_id === player.player_id)) {
      setMessage('Player already selected.');
      return;
    }
    setPlayers([...players, player]);
    // Remove the selected player from availablePlayers
    setAvailablePlayers(availablePlayers.filter((p) => p.player_id !== player.player_id));
    setMessage(null);
  };

  const handleRemovePlayer = (player_id: number) => {
    const updatedPlayers = players.filter((p) => p.player_id !== player_id);
    setPlayers(updatedPlayers);
    // Optionally, re-fetch or update availablePlayers
    // For simplicity, assuming availablePlayers can include this player now
    // In a real app, ensure data consistency
    // setAvailablePlayers([...availablePlayers, removedPlayer]);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user_id) {
      setMessage('You must be logged in to update a roster.');
      return;
    }
  
    // Validate that there are exactly 5 players
    if (players.length !== 5) {
      setMessage('Roster must contain exactly 5 players.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/rosters/${roster.roster_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt_id: roster.prompt_id, // Use existing value
          players: players.map((player) => player.player_id),
          total_salary: roster.total_salary, // Use existing value
          total_penalty: roster.total_penalty, // Use existing value
          user_id: user_id, // Use user_id from props
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update roster.');
      }
  
      setMessage('Roster updated successfully!');
      onUpdate(); // Refresh data
      onClose(); // Close the modal
    } catch (error: any) {
      setMessage(error.message || 'An error occurred.');
    }
  };
  

  return (
    <div className="edit-roster-overlay" onClick={onClose}>
      <div className="edit-roster-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Roster #{roster.roster_id}</h2>
        <form onSubmit={handleSubmit} className="edit-roster-form">
        <div className="form-group">
            <label>Prompt ID:</label>
            <span>{roster.prompt_id}</span>
        </div>

          <div className="form-group">
            <label>Players:</label>
            <ul className="player-list">
              {players.map((player) => (
                <li key={player.player_id} className="player-item">
                  <span>
                    {player.first_name} {player.last_name} - {player.team_name}
                  </span>
                  <button
                    type="button"
                    className="remove-player-button"
                    onClick={() => handleRemovePlayer(player.player_id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {players.length < 5 && (
              <div className="add-player-section">
                <SearchBar
                  searchTerm=""
                  onSearchChange={() => {}}
                  searchResults={availablePlayers}
                  onPlayerSelect={handleAddPlayer}
                  clearSearch={() => {}}
                  placeholder="Search and add players"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Total Salary:</label>
            <span>${roster.total_salary.toLocaleString()}</span>
         </div>

         <div className="form-group">
            <label>Total Penalty:</label>
            <span>${roster.total_penalty.toLocaleString()}</span>
        </div>

          <button type="submit" className="update-roster-button">
            Update Roster
          </button>
          {message && <p className="edit-roster-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditRoster;
