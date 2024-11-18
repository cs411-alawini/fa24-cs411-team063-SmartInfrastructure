import React from 'react';

interface PlayerSlotProps {
  player: any | null;
  onRemove: () => void;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({ player, onRemove }) => {
  const backgroundColor =
    player.valid === true
      ? 'lightgreen'
      : player.valid === false
      ? 'red'
      : 'white'; // Default for unvalidated players

  return (
    <div
      className="player-slot"
      style={{
        backgroundColor,
        transition: 'background-color 0.5s ease', // Smooth transition for color changes
      }}
    >
      <div className="player-container">
        {player.player_id ? (
          <>
            <img
              src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.player_id}.png`}
              alt={`${player.first_name} ${player.last_name}`}
              className="player-image"
            />
            <button className="remove-button" onClick={onRemove}>
              ✖
            </button>
          </>
        ) : (
          <img
            src="https://cdn.nba.com/headshots/nba/latest/1040x760/0.png"
            alt="Empty Slot"
            className="player-image"
          />
        )}
      </div>
      <p className="player-name">
        {player.first_name ? `${player.first_name} ${player.last_name}` : 'Empty Slot'}
      </p>
      <p className="player-salary">
        {player.salary
          ? `Salary: $${Number(player.salary).toLocaleString()}`
          : 'Salary not available'}
      </p>
      <p className="player-status">
        {player.valid === true
          ? 'Valid'
          : player.valid === false
          ? 'Invalid'
          : 'Not Checked'}
      </p>
    </div>
  );
};

export default PlayerSlot;
