import React, { useState, useEffect } from "react";
import "./styles/Leaderboard.css"

interface LeaderboardEntry {
  username: string;
  score: number;
}

interface LeaderboardProps {
  prompt_id: number; // The prompt ID for which to fetch the leaderboard
}

const Leaderboard: React.FC<LeaderboardProps> = ({ prompt_id }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/leaderboard/${prompt_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
        }
        const data: LeaderboardEntry[] = await response.json();
        setLeaderboard(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [prompt_id]);

  return (
    <div>
      <h1>Leaderboard for Prompt {prompt_id}</h1>

      {loading && <p>Loading leaderboard...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.score.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
