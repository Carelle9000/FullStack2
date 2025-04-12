import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggle }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex justify-between items-start gap-4">
      <div className="flex-1 flex items-start">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mr-4 mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />

        {/* Titre et description */}
        <div>
          <h3
            className={`text-lg font-semibold mb-1 ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          <p
            className={`text-sm whitespace-pre-line ${
              task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}
          >
            {task.description}
          </p>
        </div>
      </div>

      {/* Boutons actions */}
      <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
        <button
          onClick={() => onEdit(task)}
          className="px-4 py-1.5 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition text-sm"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-4 py-1.5 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition text-sm"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
