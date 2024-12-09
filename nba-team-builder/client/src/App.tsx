// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Import TSX components
import HeaderBar from './components/HeaderBar';
import SearchBar from './components/SearchBar';
import PlayerSlots from './components/PlayerSlots';
import TotalSalary from './components/TotalSalary';
import ErrorMessage from './components/ErrorMessage';
import PromptBox from './components/PromptBox';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import ExploreRosters from './components/ExploreRosters'; // Ensure correct import path

// Import data and utilities
import prompts from './data/prompts';
import { generateDescription } from './utils/generateDescription';

// Import Shared Types
import { Roster } from './types/Roster';

// Constants
const ROSTER_SIZE = 5;

// Initialize prompt index
let promptIndex = 0;

const App: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[promptIndex]); // Set prompt based on prompts.ts
  const [players, setPlayers] = useState<Array<any | null>>(
    Array(ROSTER_SIZE).fill({ player_id: null, valid: null }) // Initialize players with valid set to null
  );
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // AuthForm states
  const [isAuthFormVisible, setAuthFormVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('No Login');
  const [user_id, setUser_id] = useState<number>(0);

  // Profile Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  // Helper functions
  const openProfile = () => setProfileModalOpen(true);
  const closeProfile = () => setProfileModalOpen(false);

  // Submit Team states
  const [isTeamSubmitted, setIsTeamSubmitted] = useState(false);
  const [penaltyCost, setPenaltyCost] = useState(0);

  // Function to fetch players based on search term
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

  // Handle player selection from search results
  const handlePlayerSelect = (player: any) => {
    setError(null);
    setSearchTerm(''); // Clear the search bar
    setSearchResults([]); // Clear the dropdown

    // Find the first empty slot and fill it with the selected player
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

      // Add an empty slot at the end to maintain roster size
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

  // Cycle through prompts
  const cyclePrompt = () => {
    promptIndex = (promptIndex + 1) % prompts.length;
    setSelectedPrompt(prompts[promptIndex]);
  };

  // Generate request body for team validation
  const generateRequestBody = () => {
    return {
      team: players.map(player => player?.player_id), // Extract player IDs from the team array
      criteria: selectedPrompt.criteria,          // Use criteria from the selected prompt
      logicalOperator: selectedPrompt.logicalOperator || "AND" // Default to AND if not specified
    };
  };

  // Handle team submission and validation
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
      setPenaltyCost(Number(result.total_penalty));

      // Submit team to the database
      const prompt_id = promptIndex;
      const rosterPayload = {
        players: players.map((player) => player.player_id), // Extract player_id from players array
        prompt_id: prompt_id, // Include the prompt_id from your request body
        user_id: user_id, // Include the user_id from your request body
        total_salary: result.total_salary,
        total_penalty: result.total_penalty
      };

      console.log(rosterPayload);

      const rosterResponse = await fetch("http://localhost:5000/api/rosters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rosterPayload), // Send the roster payload
      });

      if (!rosterResponse.ok) {
        throw new Error(`Error submitting roster: ${rosterResponse.statusText}`);
      }

      const rosterResult = await rosterResponse.json();
      console.log("Roster created successfully:", rosterResult);

      // Update players state with validation results
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          const updatedPlayer = result.team.find(
            (p: { player_id: number }) => p.player_id === player?.player_id
          );
          return {
            ...player,
            valid: updatedPlayer?.valid ?? null, // Update valid status or set to null if not found
          };
        })
      );
    } catch (error) {
      console.error("Error validating team or submitting roster:", error);
      setError('Failed to submit team. Please try again.');
    }
    // Set submit button as pressed
    setIsTeamSubmitted(true);
  };

  // Handle user login
  const handleLogin = (user: string, user_id: string) => {
    setIsLoggedIn(true);
    setUsername(user);
    setUser_id(Number(user_id));
    setAuthFormVisible(false); // Hide the AuthForm after login
  };

  // Handle roster selection from Explore Rosters
  const handleSelectRoster = (roster: Roster) => {
    setPlayers(roster.players); // Load the selected roster's players
    navigate('/'); // Navigate back to the main application page
    // setShowExploreRosters(false); // Switch back to the main page
  };

  // Handle roster deletion from Explore Rosters
  const handleDeleteRoster = (roster_id: number) => {
    // Implement logic to remove the roster from state or refetch rosters
    console.log(`Roster ${roster_id} deleted.`);
    // Example: Refetch rosters or update state if you have rosters in state
  };

  // Handle user profile update
  const handleUserUpdate = () => {
    // Implement logic to refresh user data if needed
    console.log('User profile updated.');
  };

  // State to control Explore Rosters visibility
  // const [showExploreRosters, setShowExploreRosters] = useState(false);

  // Build the app using components and routing
  return (
    <>
      {/* Header Bar */}
      <HeaderBar
        onOpenAuthForm={() => setAuthFormVisible(true)}
        openProfile={openProfile}
        isLoggedIn={isLoggedIn}
        username={username}
      />

      {/* Authentication Form Popup */}
      {isAuthFormVisible && (
        <AuthForm
          onClose={() => setAuthFormVisible(false)}
          isRegistering={isRegistering}
          setIsRegistering={setIsRegistering}
          onLogin={handleLogin}
        />
      )}

      {/* Profile Modal */}
      {profileModalOpen && (
        <Profile
          onClose={closeProfile}
          username={username}
          user_id={user_id}
          onUserUpdate={handleUserUpdate}
        />
      )}

      {/* Define Routes */}
      <Routes>
        {/* Main Application Route */}
        <Route
          path="/"
          element={
            <div className="app-container">
              <h1 className="instructions">Create the cheapest team following these rules</h1>
              <PromptBox description={generateDescription(selectedPrompt)} onClick={cyclePrompt} />
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchResults={searchResults}
                onPlayerSelect={handlePlayerSelect}
                clearSearch={() => setSearchResults([])}
              />
              <ErrorMessage message={error} />
              <PlayerSlots players={players} onRemovePlayer={handleRemovePlayer} />
              <TotalSalary totalSalary={calculateTotalSalary()} penalty={penaltyCost} isSubmitted={isTeamSubmitted} />
              <button className="submit-button" onClick={handleSubmitTeam}>Submit Team</button>
              {/* Removed the Explore Rosters button */}
              <Leaderboard prompt_id={promptIndex} />
            </div>
          }
        />

        {/* Explore Rosters Route */}
        <Route
          path="/explore-rosters"
          element={
            <ExploreRosters
                onSelectRoster={handleSelectRoster}
                onDeleteRoster={handleDeleteRoster}
                user_id={user_id}
              />
          }
        />
      </Routes>
    </>
  );
};


export default App;
