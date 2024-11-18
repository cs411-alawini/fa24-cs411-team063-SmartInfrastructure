import React, { useRef, useEffect } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchResults: any[];
  onPlayerSelect: (player: any) => void;
  clearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  searchResults,
  onPlayerSelect,
  clearSearch,
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
        placeholder="Search for a player..."
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
            >
              {player.first_name} {player.last_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
