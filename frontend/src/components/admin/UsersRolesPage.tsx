import { useState } from 'react';
import { 
  Users,
  UserPlus,
  Mail,
  Shield,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

type UserRole = 'owner' | 'planner' | 'supervisor';
type UserStatus = 'active' | 'invited' | 'inactive';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: Date;
  lastActive?: Date;
  avatar: string;
}

const mockUsers: UserRecord[] = [
  {
    id: '1',
    name: 'Amit Mishra',
    email: 'amit.mishra@example.com',
    role: 'owner',
    status: 'active',
    joinedAt: new Date('2025-12-01'),
    lastActive: new Date('2026-01-10T15:30:00'),
    avatar: '👨‍💼',
  },
  {
    id: '2',
    name: 'Ravi Rampaul',
    email: 'ravi.rampaul@example.com',
    role: 'planner',
    status: 'active',
    joinedAt: new Date('2025-12-05'),
    lastActive: new Date('2026-01-10T14:15:00'),
    avatar: '👨‍💻',
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'supervisor',
    status: 'active',
    joinedAt: new Date('2025-12-10'),
    lastActive: new Date('2026-01-10T13:45:00'),
    avatar: '👷‍♀️',
  },
  {
    id: '4',
    name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    role: 'supervisor',
    status: 'invited',
    joinedAt: new Date('2026-01-09'),
    avatar: '👤',
  },
  {
    id: '5',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    role: 'planner',
    status: 'inactive',
    joinedAt: new Date('2025-11-15'),
    lastActive: new Date('2025-12-20'),
    avatar: '👤',
  },
];

export function UsersRolesPage() {
  const { isDarkMode } = useDarkMode();
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  
  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('supervisor');

  const handleInviteUser = () => {
    const newUser: UserRecord = {
      id: `${users.length + 1}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'invited',
      joinedAt: new Date(),
      avatar: '👤',
    };
    
    setUsers([...users, newUser]);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
    setInviteRole('supervisor');
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(u => 
      u.id === selectedUser.id ? selectedUser : u
    ));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return { label: 'Owner', color: 'text-purple-700', bgColor: 'bg-purple-100' };
      case 'planner':
        return { label: 'Planner', color: 'text-blue-700', bgColor: 'bg-blue-100' };
      case 'supervisor':
        return { label: 'Supervisor', color: 'text-green-700', bgColor: 'bg-green-100' };
    }
  };

  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return { label: 'Active', icon: CheckCircle2, color: 'text-green-700', bgColor: 'bg-green-100' };
      case 'invited':
        return { label: 'Invited', icon: Mail, color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
      case 'inactive':
        return { label: 'Inactive', icon: Clock, color: 'text-gray-700', bgColor: 'bg-gray-100' };
    }
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const invitedUsers = users.filter(u => u.status === 'invited').length;

  return (
    <>
      <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className={`border-b px-4 sm:px-6 lg:px-8 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Users & Roles</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activeUsers} active • {invitedUsers} pending invitation
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Invite User</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Users Table */}
            <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>User</th>
                    <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</th>
                    <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Joined</th>
                    <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Active</th>
                    <th className={`px-6 py-3 text-left text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {users.map(user => {
                    const roleConfig = getRoleConfig(user.role);
                    const statusConfig = getStatusConfig(user.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={user.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{user.avatar}</span>
                            <div>
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs ${roleConfig.bgColor} ${roleConfig.color}`}>
                            {roleConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${statusConfig.bgColor} ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.joinedAt.toLocaleDateString()}
                        </td>
                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.lastActive 
                            ? user.lastActive.toLocaleString()
                            : user.status === 'invited'
                            ? 'Pending'
                            : 'Never'
                          }
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditModal(true);
                              }}
                              className={`p-2 rounded transition-colors ${isDarkMode ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-50'}`}
                              title="Edit user"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              className={`p-2 rounded transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'}`}
                              title="Remove user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Role Descriptions */}
            <div className={`mt-6 border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Role Permissions</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">
                      Owner
                    </span>
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Full system access. Can view all KPIs, manage users, configure organization settings, and access audit logs.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                      Planner
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Production management. Can create runs, manage schedules, validate inputs, handle events, and generate AI briefs.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                      Supervisor
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Shopfloor operations. Can view today's schedule, acknowledge tasks, respond to alerts, log actuals, and check quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Invite User</h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="inviteName" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="inviteName"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'}`}
                />
              </div>

              <div>
                <label htmlFor="inviteEmail" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="inviteEmail"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="john.smith@example.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'}`}
                />
              </div>

              <div>
                <label htmlFor="inviteRole" className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role <span className="text-red-600">*</span>
                </label>
                <select
                  id="inviteRole"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                >
                  <option value="supervisor">Supervisor</option>
                  <option value="planner">Planner</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className={`border rounded-lg p-3 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  An invitation email will be sent to {inviteEmail || 'the user'} with instructions to set up their account.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleInviteUser}
                disabled={!inviteEmail || !inviteName}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  inviteEmail && inviteName
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Edit User</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as UserRole })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                >
                  <option value="supervisor">Supervisor</option>
                  <option value="planner">Planner</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </label>
                <select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value as UserStatus })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                >
                  <option value="active">Active</option>
                  <option value="invited">Invited</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Remove User?</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Are you sure you want to remove <span className="font-medium">{selectedUser.name}</span>? 
                  This will revoke their access to the system.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}