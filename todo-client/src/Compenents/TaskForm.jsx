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
   <form
  onSubmit={handleSubmit}
  className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200 w-full mx-auto space-y-4 transition-all">
  <h2 className="text-2xl font-semibold text-blue-900 mb-4">
    {selectedTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
  </h2>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
    <input
      type="text"
      placeholder="Titre"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
    <textarea
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={4}
      className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    />
  </div>

  <div className="flex items-center gap-3 pt-2">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
    >
      {selectedTask ? 'Mettre à jour' : 'Ajouter'}
    </button>

    {selectedTask && (
      <button
        type="button"
        onClick={cancelEdit}
        className="text-gray-600 hover:text-gray-900 underline text-sm transition"
      >
        Annuler
      </button>
    )}
  </div>
</form>

  );
};

export default TaskForm;
