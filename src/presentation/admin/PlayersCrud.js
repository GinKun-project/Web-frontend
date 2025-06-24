import React, { useEffect, useState } from "react";
import {
  getAllPlayersUseCase,
  createPlayerUseCase,
  updatePlayerUseCase,
  deletePlayerUseCase,
} from "../../domain/admin/usecases";

export default function PlayersCrud() {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({ username: "", level: 1 });
  const [error, setError] = useState(null);

  const fetchPlayers = async () => {
    try {
      const res = await getAllPlayersUseCase();

      if (res?.success && Array.isArray(res.data)) {
        setPlayers(res.data);
      } else {
        setPlayers([]);
        setError("Failed to load players");
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      setPlayers([]);
      setError("Network error while loading players");
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleCreate = async () => {
    if (!newPlayer.username) return;
    try {
      await createPlayerUseCase(newPlayer);
      setNewPlayer({ username: "", level: 1 });
      fetchPlayers();
    } catch (err) {
      setError("Failed to create player");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updatePlayerUseCase(id, updatedData);
      fetchPlayers();
    } catch (err) {
      setError("Failed to update player");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlayerUseCase(id);
      fetchPlayers();
    } catch (err) {
      setError("Failed to delete player");
    }
  };

  return (
    <div className="crud-panel">
      <h3>🎮 Players Management</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="crud-create">
        <input
          type="text"
          placeholder="Username"
          value={newPlayer.username}
          onChange={(e) => setNewPlayer({ ...newPlayer, username: e.target.value })}
        />
        <input
          type="number"
          placeholder="Level"
          value={newPlayer.level}
          onChange={(e) => setNewPlayer({ ...newPlayer, level: Number(e.target.value) })}
        />
        <button onClick={handleCreate}>Add Player</button>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(players) &&
            players.map((player) => (
              <tr key={player._id}>
                <td>
                  <input
                    value={player.username}
                    onChange={(e) =>
                      setPlayers((prev) =>
                        prev.map((p) =>
                          p._id === player._id ? { ...p, username: e.target.value } : p
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={player.level}
                    onChange={(e) =>
                      setPlayers((prev) =>
                        prev.map((p) =>
                          p._id === player._id ? { ...p, level: Number(e.target.value) } : p
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleUpdate(player._id, player)}>Save</button>
                  <button onClick={() => handleDelete(player._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
