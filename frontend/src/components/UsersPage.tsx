import { useState } from 'react';
import { Plus, Search, Filter, UserPlus, Mail, Shield } from 'lucide-react';
import { useDarkMode } from './DarkModeContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'planner' | 'supervisor';
  status: 'active' | 'inactive';
  lastActive: string;
  avatar: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Amit Mishra',
    email: 'amit.mishra@company.com',
    role: 'owner',
    status: 'active',
    lastActive: '2 hours ago',
    avatar: '👨‍💼',
  },
  {
    id: '2',
    name: 'Ravi Rampaul',
    email: 'ravi.rampaul@company.com',
    role: 'planner',
    status: 'active',
    lastActive: '30 minutes ago',
    avatar: '👨‍💻',
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    role: 'supervisor',
    status: 'active',
    lastActive: '1 hour ago',
    avatar: '👷‍♀️',
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'supervisor',
    status: 'active',
    lastActive: '5 hours ago',
    avatar: '👨‍🔧',
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'planner',
    status: 'inactive',
    lastActive: '2 days ago',
    avatar: '👩‍💼',
  },
];

export function UsersPage() {
  const { isDarkMode } = useDarkMode();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showAddUser, setShowAddUser] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleColors = {
    owner: 'bg-purple-100 text-purple-700',
    planner: 'bg-blue-100 text-blue-700',
    supervisor: 'bg-green-100 text-green-700',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>User Management</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
          <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{users.length}</p>
        </div>
        <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Owners</p>
          <p className="text-2xl text-purple-600">{users.filter(u => u.role === 'owner').length}</p>
        </div>
        <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Planners</p>
          <p className="text-2xl text-blue-600">{users.filter(u => u.role === 'planner').length}</p>
        </div>
        <div className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Supervisors</p>
          <p className="text-2xl text-green-600">{users.filter(u => u.role === 'supervisor').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-lg border p-4 mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="planner">Planner</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <tr>
                <th className={`text-left text-sm px-6 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>User</th>
                <th className={`text-left text-sm px-6 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</th>
                <th className={`text-left text-sm px-6 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</th>
                <th className={`text-left text-sm px-6 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                <th className={`text-left text-sm px-6 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Active</th>
                <th className={`text-right text-sm px-6 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{user.avatar}</span>
                      <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${roleColors[user.role]}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.lastActive}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-blue-600 hover:text-blue-700 mr-3">
                      Edit
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Dialog */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg max-w-md w-full p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Add New User</h3>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@company.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                <div className="relative">
                  <Shield className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <select className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="supervisor">Supervisor</option>
                    <option value="planner">Planner</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>

              <div className={`border rounded-lg p-3 ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  An invitation email will be sent to the user with login instructions.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddUser(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}