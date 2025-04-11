<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{

    public function index()
{
                return Task::all();

    //$user = auth()->user();

    // Autorise via la policy
    //if ($user->can('viewAny', Task::class)) {
      //  return Task::with('user')->latest()->get(); // admin => toutes les tâches
    //}

    //return Task::where('user_id', $user->id)->latest()->get(); // utilisateur => seulement ses tâches
}


    public function store(Request $request)
    {
        // Validation des données
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
    
        // Création de la tâche
       // $task = Task::create($request->only('title', 'description'));
    

        $task = new Task();
        $task->title = $request->title;
        $task->description = $request->description;
        $task->user_id = auth()->id(); // 🔐 utilisateur connecté
        $task->save();
        $task->completed = false;
        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task->update($request->only('title', 'description'));

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }

    public function toggle($id)
{
    // Trouver la tâche par son ID
    $task = Task::findOrFail($id);

    // Bascule le statut "completed"
    $task->completed = !$task->completed;

    // Sauvegarde la tâche mise à jour
    $task->save();

    return response()->json($task);
}

public function toggleCompleted($id)
{
    $task = Task::findOrFail($id);
    $task->completed = !$task->completed;
    $task->save();

    return response()->json($task);
}


}

