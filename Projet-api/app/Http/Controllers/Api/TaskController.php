<?php

namespace App\Http\Controllers\Api;

//use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{

    public function __construct()
    {
    $this->middleware('auth:api'); // Applique l'authentification sur toutes les méthodes
    }

    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return Task::with('user')->latest()->get(); // admin → toutes les tâches
        }

        return Task::where('user_id', $user->id)->latest()->get(); // utilisateur → ses tâches
    }

    public function store(Request $request)
{
    // ✅ Vérifie que l'utilisateur est bien connecté
    if (!auth()->check()) {
        return response()->json(['error' => 'Utilisateur non authentifié'], 401);
    }

    // ✅ Validation des données
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
    ]);

    // ✅ Création de la tâche
    $task = new Task();
    $task->title = $request->title;
    $task->description = $request->description;
    $task->user_id = auth()->id(); // ✅ utilisateur connecté
    $task->completed = false;
    $task->save();

    return response()->json($task, 201);
}


    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task->title = $validated['title'];
        $task->description = $validated['description'] ?? null;
        $task->save();

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Tâche supprimée']);
    }


public function toggle(Task $task)
{
    try {
        // Vérifie que l'utilisateur est connecté
        if (!auth()->check()) {
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Vérifie que la tâche appartient à l'utilisateur connecté
        if ($task->user_id !== auth()->id()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Toggle completed
        $task->completed = !$task->completed;
        $task->save();

        return response()->json($task);
    } catch (\Exception $e) {
        // En cas d'erreur, logue et retourne un message lisible
        \Log::error('Erreur toggle tâche : ' . $e->getMessage());
        return response()->json(['error' => 'Erreur serveur'], 500);
    }
}

    
}
