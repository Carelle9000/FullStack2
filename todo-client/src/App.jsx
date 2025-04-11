import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import TaskList from "./Compenents/TaskList";
import TaskForm from './Compenents/TaskForm';
import TaskItem from './Compenents/TaskItem';


const App = () => {
    return (
        <Router>
            <Routes>
                {/* Routes publiques */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Routes privées liées aux tâches */}
                <Route
                   path="/tasks"
                   element={
                   <PrivateRoute>
                       <TaskList /> {/* Affiche la liste – correspond à `index()` */}
                   </PrivateRoute>
                   }
                />

                <Route
                    path="/tasks/create"
                    element={
                    <PrivateRoute>
                      <TaskForm mode="create" /> {/* Création – correspond à `store()` */}
                   </PrivateRoute>
                }
               />

                <Route
                   path="/tasks/edit/:id"
                   element={
                   <PrivateRoute>
                     <TaskForm mode="edit" /> {/* Édition – correspond à `update($id)` */}
                   </PrivateRoute>
                    }
                />

                 <Route
                    path="/tasks/delete/:id"
                    element={
                    <PrivateRoute>
                      <TaskItem mode="delete" /> {/* Suppression – correspond à `destroy($id)` */}
                    </PrivateRoute>
                    }
                />

                <Route
                   path="/tasks/toggle/:id"
                   element={
                   <PrivateRoute>
                        <TaskItem mode="toggle" /> {/* Toggle "completed" – correspond à `toggle($id)` */}
                   </PrivateRoute>
                   }
               />


                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
