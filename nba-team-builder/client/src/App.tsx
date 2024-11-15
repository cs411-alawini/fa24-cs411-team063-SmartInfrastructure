import React, { useState } from 'react';

const App: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [playerInfo, setPlayerInfo] = useState<any | null>(null);
  const [headshotUrl, setHeadshotUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    setPlayerInfo(null);
    setHeadshotUrl(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both first and last name.');
      return;
    }
    try {
      // Fetch player info
      const url = `http://localhost:5000/api/players?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}`;
      const response = await fetch(
        url
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred while fetching player info.');
        return;
      }

      const data = await response.json();
      setPlayerInfo(data[0]);

      // Generate the headshot URL using person_id
      if (data[0].person_id) {
        const headshotUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${data[0].person_id}.png`;
        setHeadshotUrl(headshotUrl);
        console.log(headshotUrl)
      }
    } catch (err) {
      setError('Failed to fetch player information. Please try again later.');
    }
  };

  return (
    <div className="app-container">
      <h1>NBA Player Search</h1>
      <div>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ marginRight: '10px', padding: '10px' }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ marginRight: '10px', padding: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px' }}>
          Search
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      {playerInfo && (
        <div style={{ marginTop: '20px' }}>
          <h2>Player Info</h2>
          <p>
            <strong>Name:</strong> {playerInfo.first_name} {playerInfo.last_name}
          </p>
          <p>
            <strong>Team ID:</strong> {playerInfo.team_id}
          </p>
          <p>
            <strong>Position:</strong> {playerInfo.position}
          </p>
          <p>
            <strong>Draft Year:</strong> {playerInfo.draft_year}
          </p>
        </div>
      )}
      {headshotUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Player Headshot</h2>
          <img
            src={headshotUrl}
            alt="Player Headshot"
            style={{ width: '200px', height: '200px', borderRadius: '10px' }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
