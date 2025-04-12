import React, { useState, useEffect } from 'react';
import {
  FiHome, FiPieChart, FiUsers, FiSettings,
  FiFileText, FiCalendar, FiBell, FiSearch,
  FiMenu, FiChevronDown,
} from 'react-icons/fi';
import TaskList from './Compenents/TaskList';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user info when component is mounted
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:8000/api/user', {
          headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setUser(data); // { name: "...", email: "...", etc. }
      } catch (err) {
        console.error('Erreur lors de la récupération de l’utilisateur:', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
    
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
    
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className={`bg-blue-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          <h1 className="text-xl font-bold">{sidebarOpen ? 'AdminPro' : 'AP'}</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-blue-700">
            <FiMenu size={20} />
          </button>
        </div>

        <nav className="mt-6">
          {[ 
            { icon: <FiHome />, name: 'Dashboard', key: 'dashboard' },
            { icon: <FiPieChart />, name: 'Analytics', key: 'analytics' },
            { icon: <FiUsers />, name: 'Clients', key: 'clients' },
            { icon: <FiFileText />, name: 'Projects', key: 'projects' },
            { icon: <FiCalendar />, name: 'Calendar', key: 'calendar' },
            { icon: <FiSettings />, name: 'Settings', key: 'settings' },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors ${
                activeMenu === item.key ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
          <div className="relative">
            {/* Replacing Search Bar with User's Name */}
            <div className="text-gray-700 text-lg font-medium">
              Bonjour, {user?.name || 'Utilisateur'} 👋
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotificationOpen(!notificationOpen)} className="p-2 rounded-full hover:bg-gray-100 relative">
                <FiBell size={20} className="text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="p-2">
                    <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <p className="text-sm">New project assigned</p>
                      <p className="text-xs text-gray-500">2 mins ago</p>
                    </div>
                    <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <p className="text-sm">System update available</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {sidebarOpen && (
                  <>
                    <span className="text-gray-700">{user?.name}</span>
                    <FiChevronDown
                      className={`text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                    />
                  </>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <div className="bg-white p-4 border-b">
                    <h2 className="text-md font-semibold">Bienvenue, {user?.name || 'Utilisateur'}</h2>
                    <p className="text-sm text-gray-500">Rôle : {user?.role || 'Client'}</p>
                  </div>
                  <div className="p-2">
                  
                    <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="block px-3 py-2 text-sm hover:bg-red-400 rounded"> Déconnexion</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Generate Report
            </button>
          </div>

          {/* Admin-only action */}
          {user?.role === 'admin' && (
            <div className="mb-6">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                Gérer les rôles
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[ 
              { title: 'Revenu Total', value: '$48,245', change: '+12%', icon: '💰' },
              { title: 'Nouveaux Utilisateurs', value: '245', change: '+5%', icon: '👥' },
              { title: 'Utilisateurs connectes', value: '32', change: '+3', icon: '📁' },
              { title: 'Taches faites', value: '87%', change: '+7%', icon: '✅' },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Task List Section */}
          <div className="w-full">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <TaskList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
