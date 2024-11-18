import React from 'react';
import PlayerSlot from './PlayerSlot';
import './styles/PlayerSlots.css'

interface PlayerSlotsProps {
  players: (any | null)[];
  onRemovePlayer: (index: number) => void;
}

const PlayerSlots: React.FC<PlayerSlotsProps> = ({ players, onRemovePlayer }) => (
  <div className="player-slots">
    {players.map((player, index) => (
      <PlayerSlot
        key={index}
        player={player}
        onRemove={() => onRemovePlayer(index)}
      />
    ))}
  </div>
);

export default PlayerSlots;
