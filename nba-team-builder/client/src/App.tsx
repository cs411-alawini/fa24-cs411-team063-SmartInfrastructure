import React, { useState, useEffect, useRef } from 'react';
import './App.css'
import prompts from './data/prompts'


// Import tsx components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PlayerSlots from './components/PlayerSlots';
import TotalSalary from './components/TotalSalary';
import ErrorMessage from './components/ErrorMessage';
import PromptBox from './components/PromptBox';
import { generateDescription } from './utils/generateDescription';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]); // set prompt based on what's in prompts.ts
  const [players, setPlayers] = useState<Array<any | null>>(
    Array(5).fill({ player_id: null, valid: null }) // Initialize players with valid set to null
  );
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
  
    // Find the first empty slot (where player_id is null) and fill it with the selected player
    const updatedPlayers = [...players];
    const emptyIndex = updatedPlayers.findIndex((slot) => slot.player_id === null);
  
    if (emptyIndex !== -1) {
      updatedPlayers[emptyIndex] = { ...player, valid: null }; // Add player with valid set to null
      setPlayers(updatedPlayers);
    } else {
      setError('All slots are already filled. Please remove a player to add another.');
    }
  };

  // Function to remove a player and cascade remaining players to the left
  const handleRemovePlayer = (index: number) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
  
      // Remove the player at the specified index
      updatedPlayers.splice(index, 1);
  
      // Add an empty slot at the end to maintain 5 slots
      updatedPlayers.push({ player_id: null, valid: null });
  
      return updatedPlayers;
    });
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



  const generateRequestBody = () => {
    return {
      team: players.map(player => player?.player_id), // Extract player IDs from the team array
      criteria: selectedPrompt.criteria,          // Use criteria from the selected prompt
      logicalOperator: selectedPrompt.logicalOperator || "AND" // Default to AND if not specified
    };
  };

  // Handle team validation after team is submitted
  const handleSubmitTeam = async () => {
    try {
      const payload = generateRequestBody(); // Generate the request body
  
      const response = await fetch("http://localhost:5000/api/validate-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the generated payload
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Validation result:", result);
  
      // Update players state with validation results
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) => {
          const updatedPlayer = result.team.find(
            (p: any) => p.player_id === player?.player_id
          );
          return {
            ...player,
            valid: updatedPlayer?.valid ?? null, // Update valid status or set to null if not found
          };
        })
      );
    } catch (error) {
      console.error("Error validating team:", error);
    }
  };
  

// Build the app using our components
  return (
    <div className="app-container">
      <Header />
      <PromptBox description={generateDescription(selectedPrompt)} />
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
      <button onClick={handleSubmitTeam}>Submit Team</button>
    </div>
  );
};

export default App;
