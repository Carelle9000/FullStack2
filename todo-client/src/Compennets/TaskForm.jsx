import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, selectedTask, cancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [selectedTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, id: selectedTask?.id });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm mb-6 border">
      <h2 className="text-xl font-bold text-blue-800 mb-3">
        {selectedTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
      </h2>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-3"
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {selectedTask ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {selectedTask && (
          <button type="button" onClick={cancelEdit} className="text-gray-600 hover:underline">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
