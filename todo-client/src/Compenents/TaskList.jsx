import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:8000/api/tasks', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      setTasks(data);
      console.log('✅ Tâches chargées:', data);
    } catch (error) {
      setError(error.message);
      console.error('❌ Erreur lors du chargement des tâches:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateTask = async (task) => {
    const token = localStorage.getItem('token');
    const url = task.id
      ? `http://localhost:8000/api/tasks/${task.id}`
      : `http://localhost:8000/api/tasks`;

    try {
      const res = await fetch(url, {
        method: task.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) throw new Error('Échec création/modification');

      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('❌ Erreur ajout/modif tâche:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (error) {
      console.error('❌ Erreur suppression tâche:', error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/toggle/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Échec du toggle');

      fetchTasks();
    } catch (error) {
      console.error('❌ Erreur toggle tâche:', error);
    }
  };

  // Liste des utilisateurs uniques (à partir des tâches)
  const users = [...new Set(tasks.map((t) => t.user?.name).filter(Boolean))];

  const filteredTasks = tasks.filter((task) => {
    const isDone = !!task.completed;

    const matchFilter =
      (filter === 'completed' && isDone) ||
      (filter === 'pending' && !isDone) ||
      filter === 'all';

    const matchUser = selectedUser ? task.user?.name === selectedUser : true;

    return matchFilter && matchUser;
  });

  return (
    <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 🧾 Formulaire */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 mb-8">
        <TaskForm
          onSubmit={addOrUpdateTask}
          selectedTask={editingTask}
          cancelEdit={() => setEditingTask(null)}
        />
      </div>

      {/* 🔘 Filtres */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {['all', 'completed', 'pending'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              filter === f
                ? f === 'completed'
                  ? 'bg-green-600 text-white'
                  : f === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {f === 'all' && 'Toutes'}
            {f === 'completed' && 'Terminées'}
            {f === 'pending' && 'À faire'}
          </button>
        ))}

        {/* 🎛️ Filtre par utilisateur */}
        {users.length > 0 && (
          <select
            className="px-4 py-1.5 border border-gray-200 rounded-full text-sm text-gray-700"
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
          >
            <option value="">Tous les utilisateurs</option>
            {users.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 📋 Liste */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 italic">Chargement…</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={deleteTask}
              onToggle={toggleTask}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10 italic">
            Aucune tâche pour ce filtre.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
