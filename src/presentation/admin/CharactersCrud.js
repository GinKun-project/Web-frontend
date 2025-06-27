import React, { useEffect, useState } from "react";
import {
  getAllCharactersUseCase,
  createCharacterUseCase,
  updateCharacterUseCase,
  deleteCharacterUseCase,
} from "../../domain/admin/usecases";

export default function CharactersCrud() {
  const [characters, setCharacters] = useState([]);
  const [newChar, setNewChar] = useState({ name: "", type: "" });
  const [error, setError] = useState(null);

  const fetchCharacters = async () => {
    try {
      const res = await getAllCharactersUseCase();
      if (res?.success && Array.isArray(res.data)) {
        setCharacters(res.data);
      } else {
        setCharacters([]);
        setError("Invalid character list format");
      }
    } catch {
      setError("Network error while fetching characters");
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleCreate = async () => {
    if (!newChar.name || !newChar.type) return;
    try {
      await createCharacterUseCase(newChar);
      setNewChar({ name: "", type: "" });
      fetchCharacters();
    } catch {
      setError("Error creating character");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateCharacterUseCase(id, updatedData);
      fetchCharacters();
    } catch {
      setError("Error updating character");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCharacterUseCase(id);
      fetchCharacters();
    } catch {
      setError("Error deleting character");
    }
  };

  return (
    <div className="crud-panel">
      <h3>🧙‍♂️ Characters Management</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="crud-create">
        <input
          type="text"
          placeholder="Name"
          value={newChar.name}
          onChange={(e) => setNewChar({ ...newChar, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type"
          value={newChar.type}
          onChange={(e) => setNewChar({ ...newChar, type: e.target.value })}
        />
        <button onClick={handleCreate}>Add Character</button>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((char) => (
            <tr key={char._id}>
              <td>
                <input
                  value={char.name}
                  onChange={(e) =>
                    setCharacters((prev) =>
                      prev.map((c) =>
                        c._id === char._id ? { ...c, name: e.target.value } : c
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  value={char.type}
                  onChange={(e) =>
                    setCharacters((prev) =>
                      prev.map((c) =>
                        c._id === char._id ? { ...c, type: e.target.value } : c
                      )
                    )
                  }
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(char._id, char)}>Save</button>
                <button onClick={() => handleDelete(char._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
