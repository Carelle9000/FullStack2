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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si le titre est vide, on ne soumet pas le formulaire
    if (!title.trim()) return;

    // Envoie de la requête API pour ajouter ou mettre à jour la tâche
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Token d'authentification manquant.");
        return;
      }

      // Choisir la méthode de requête : POST pour création, PUT pour modification
      const method = selectedTask ? 'PUT' : 'POST';
      const url = selectedTask
        ? `http://localhost:8000/api/tasks/${selectedTask.id}`
        : 'http://localhost:8000/api/tasks';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Utilisation du token
        },
        credentials: 'include', // Inclut les cookies si nécessaire
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la création/modification de la tâche');
      }

      const data = await res.json();
      console.log('Tâche ajoutée ou modifiée avec succès:', data);

      // Réinitialiser les champs du formulaire après soumission
      setTitle('');
      setDescription('');

      // Appeler la fonction de rappel après la soumission
      onSubmit(data);
    } catch (error) {
      console.error('Erreur ajout/modification tâche:', error);
      alert('Échec de l\'ajout/modification de la tâche');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200 w-full mx-auto space-y-4 transition-all"
    >
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
