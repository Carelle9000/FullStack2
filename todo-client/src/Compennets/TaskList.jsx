import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // 📥 Charger les tâches depuis l'API Laravel
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:8000/api/tasks');
    const data = await res.json();
    setTasks(data);
  };

  const addOrUpdateTask = async (task) => {
    if (task.id) {
      // Update
      await fetch(`http://localhost:8000/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
    } else {
      // Create
      await fetch(`http://localhost:8000/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
    }
    fetchTasks();
    setEditingTask(null);
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:8000/api/tasks/${id}`, {
      method: 'DELETE',
    });
    fetchTasks();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <TaskForm
        onSubmit={addOrUpdateTask}
        selectedTask={editingTask}
        cancelEdit={() => setEditingTask(null)}
      />
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={setEditingTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
