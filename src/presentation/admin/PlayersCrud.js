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

  const fetchPlayers = async () => {
    const res = await getAllPlayersUseCase();
    setPlayers(res);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleCreate = async () => {
    if (!newPlayer.username) return;
    await createPlayerUseCase(newPlayer);
    setNewPlayer({ username: "", level: 1 });
    fetchPlayers();
  };

  const handleUpdate = async (id, updatedData) => {
    await updatePlayerUseCase(id, updatedData);
    fetchPlayers();
  };

  const handleDelete = async (id) => {
    await deletePlayerUseCase(id);
    fetchPlayers();
  };

  return (
    <div className="crud-panel">
      <h3>🎮 Players Management</h3>

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
          {players.map((player) => (
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
