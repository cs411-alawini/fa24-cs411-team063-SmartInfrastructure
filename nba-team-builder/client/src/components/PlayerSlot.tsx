import React from 'react';

interface PlayerSlotProps {
  player: any | null;
  onRemove: () => void;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({ player, onRemove }) => (
  <div className="player-slot">
    <div className="player-container">
      <img
        src={
          player
            ? `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.player_id}.png`
            : 'https://cdn.nba.com/headshots/nba/latest/1040x760/0.png'
        }
        alt={player ? `${player.first_name} ${player.last_name}` : 'Empty Slot'}
        className="player-image"
      />
      {player && (
        <button className="remove-button" onClick={onRemove}>
          ✖
        </button>
      )}
    </div>
    <p className="player-name">
      {player ? `${player.first_name} ${player.last_name}` : 'Empty Slot'}
    </p>
    <p className="player-salary">
      {player?.salary ? `$${Number(player.salary).toLocaleString()}` : ''}
    </p>
  </div>
);

export default PlayerSlot;
