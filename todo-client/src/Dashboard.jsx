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

  useEffect(() => {
    fetch('http://localhost:8000/api/me', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Erreur user:', err));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div
        className={`bg-blue-800 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          <h1 className="text-xl font-bold">{sidebarOpen ? 'AdminPro' : 'AP'}</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-blue-700"
          >
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
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <FiBell size={20} className="text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
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
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase() }
                </div>
                {sidebarOpen && (
                  <>
                    <span className="text-gray-700">{user?.name}</span>
                    <FiChevronDown
                      className={`text-gray-500 transition-transform ${
                        profileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium">{user?.name || '...'}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || 'client'}
                    </p>
                  </div>
                  <div className="p-1">
                    <a href="#" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded">Profile</a>
                    <a href="#" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded">Settings</a>
                    <a href="#" className="block px-3 py-2 text-sm hover:bg-gray-100 rounded">Logout</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
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
              { title: 'Total Revenue', value: '$48,245', change: '+12%', icon: '💰' },
              { title: 'New Clients', value: '245', change: '+5%', icon: '👥' },
              { title: 'Projects', value: '32', change: '+3', icon: '📁' },
              { title: 'Tasks Completed', value: '87%', change: '+7%', icon: '✅' },
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

          {/* Task List */}
          <div className='w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6'>
             <TaskList />
          </div>

          {/* (Remaining layout unchanged, charts, recent activity, tables, etc.) */}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
