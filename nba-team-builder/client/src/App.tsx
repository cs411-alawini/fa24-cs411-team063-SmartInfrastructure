import React, { useState, useEffect, useRef } from 'react';
import './App.css'

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [players, setPlayers] = useState<Array<any | null>>(Array(5).fill(null)); // 5 empty slots
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to fetch players for the search term
  const fetchSearchResults = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const url = `http://localhost:5000/api/players?first_name=${encodeURIComponent(term)}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred while searching players.');
        return;
      }

      const data = await response.json();
      setSearchResults(data); // Update the dropdown results
    } catch (err) {
      setError('Failed to fetch search results. Please try again later.');
    }
  };

  // Function to handle player selection
  const handlePlayerSelect = (player: any) => {
    setError(null);
    setSearchTerm(''); // Clear the search bar
    setSearchResults([]); // Clear the dropdown

    // Find the first empty slot and fill it with the selected player
    const updatedPlayers = [...players];
    const emptyIndex = updatedPlayers.findIndex((slot) => slot === null);
    if (emptyIndex !== -1) {
      updatedPlayers[emptyIndex] = player;
      setPlayers(updatedPlayers);
    } else {
      setError('All slots are already filled. Please remove a player to add another.');
    }
  };

  // Function to remove a player and cascade remaining players to the left
  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, idx) => idx !== index); // Remove the player at the index
    while (updatedPlayers.length < 5) {
      updatedPlayers.push(null); // Ensure there are always 5 slots
    }
    setPlayers(updatedPlayers);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchSearchResults(term); // Fetch search results as the user types
  };

  // Hide search results when clicking outside the search bar or dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSearchResults([]); // Clear dropdown results
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="app-container">
      <h1>Your Team</h1>

      <div className="search-container" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search for a player..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
        {searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((player) => (
              <div
                key={player.player_id}
                className="search-result"
                onClick={() => handlePlayerSelect(player)}
              >
                {player.first_name} {player.last_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      <div className="player-slots">
      {
        players.map((player, index) => (
          player ? (
            <div key={index} className="player-slot">
              <div className="player-container">
                <img
                  src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.player_id}.png`}
                  alt={`${player.first_name} ${player.last_name}`}
                  className="player-image"
                />
                <button
                  className="remove-button"
                  onClick={() => handleRemovePlayer(index)}
                >
                  ✖
                </button>
              </div>
              <p className="player-name">{player.first_name} {player.last_name}</p>
              <p className="player-salary">
                {player.salary ? `$${Number(player.salary).toLocaleString()}` : 'Salary not available'}
              </p>
            </div>
          ) : (
            <div key={index} className="player-slot">
              <div className="player-container">
                <img
                  src="https://cdn.nba.com/headshots/nba/latest/1040x760/0.png"
                  alt="Empty Slot"
                  className="player-image"
                />
              </div>
              <p className="player-name">Empty Slot</p>
            </div>
          )
        ))
      }

      </div>
    </div>
  );
};

export default App;
