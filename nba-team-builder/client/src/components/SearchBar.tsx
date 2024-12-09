import React, { useRef, useEffect } from 'react';
import './styles/SearchBar.css'

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchResults: any[];
  onPlayerSelect: (player: any) => void;
  clearSearch: () => void;
  placeholder?: string; // Add this line
}

// Fetches URL for team's logo based on teamId
const getTeamLogoUrl = (teamId: string) =>
    `https://cdn.nba.com/logos/nba/${teamId}/primary/L/logo.svg`;

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  searchResults,
  onPlayerSelect,
  clearSearch,
  placeholder = "Search players...",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        clearSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clearSearch]);

  return (
    <div className="search-container" ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-bar"
      />
      {searchResults.length > 0 && (
        <div className="search-dropdown">
          {searchResults.map((player) => (
            <div
              key={player.player_id}
              className="search-result"
              onClick={() => onPlayerSelect(player)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <img
                src={getTeamLogoUrl(player.team_id)}
                alt={`${player.team_name} logo`}
                style={{ width: '24px', height: '24px', borderRadius: '50%' }}
              />
              <span>{player.first_name} {player.last_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
