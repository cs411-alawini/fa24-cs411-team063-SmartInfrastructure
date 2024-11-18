import React, { useState, useEffect, useRef } from 'react';
import './App.css'


// Import tsx components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PlayerSlots from './components/PlayerSlots';
import TotalSalary from './components/TotalSalary';
import ErrorMessage from './components/ErrorMessage';

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

  // Calculate total salary cost
  const calculateTotalSalary = () => {
    return players.reduce((total, player) => {
      return total + (player?.salary ? Number(player.salary) : 0);
    }, 0);
  };

  // Handle search input change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    fetchSearchResults(term); // Fetch results based on user input
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
      <Header />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchResults={searchResults}
        onPlayerSelect={handlePlayerSelect}
        clearSearch={() => setSearchResults([])}
      />
      <ErrorMessage message={error} />
      <PlayerSlots players={players} onRemovePlayer={handleRemovePlayer} />
      <TotalSalary totalSalary={calculateTotalSalary()} />
    </div>
  );
};

export default App;
