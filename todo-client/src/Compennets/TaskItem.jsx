import React from 'react';

const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center border">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 text-blue-600 hover:underline"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 text-red-500 hover:underline"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
