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

  const fetchCharacters = async () => {
    const res = await getAllCharactersUseCase();
    setCharacters(res);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleCreate = async () => {
    if (!newChar.name || !newChar.type) return;
    await createCharacterUseCase(newChar);
    setNewChar({ name: "", type: "" });
    fetchCharacters();
  };

  const handleUpdate = async (id, updatedData) => {
    await updateCharacterUseCase(id, updatedData);
    fetchCharacters();
  };

  const handleDelete = async (id) => {
    await deleteCharacterUseCase(id);
    fetchCharacters();
  };

  return (
    <div className="crud-panel">
      <h3>🧙‍♂️ Characters Management</h3>

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
