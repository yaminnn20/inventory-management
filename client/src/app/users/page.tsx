"use client";

import { useState, useEffect } from "react";
import { useGetUsersQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { 
  User, 
  Mail, 
  Search, 
  Users as UsersIcon, 
  UserPlus, 
  Shield, 
  Phone, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Activity, 
  Filter, 
  ChevronDown, 
  Download, 
  MoreVertical,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Mock data for customer activities
const mockActivities = [
  { id: 1, userId: 1, type: 'purchase', description: 'Purchased Product A', date: '2023-04-10', status: 'completed' },
  { id: 2, userId: 2, type: 'support', description: 'Opened support ticket', date: '2023-04-09', status: 'pending' },
  { id: 3, userId: 3, type: 'feedback', description: 'Left 5-star review', date: '2023-04-08', status: 'completed' },
  { id: 4, userId: 4, type: 'purchase', description: 'Purchased Product B', date: '2023-04-07', status: 'completed' },
  { id: 5, userId: 5, type: 'support', description: 'Resolved support ticket', date: '2023-04-06', status: 'completed' },
];

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
  { 
    field: "role", 
    headerName: "Role", 
    width: 130,
    renderCell: (params) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        params.value === 'admin' 
          ? 'bg-purple-100 text-purple-800' 
          : 'bg-blue-100 text-blue-800'
      }`}>
        {params.value || 'User'}
      </span>
    )
  },
  { 
    field: "status", 
    headerName: "Status", 
    width: 130,
    renderCell: (params) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        params.value === 'active' 
          ? 'bg-green-100 text-green-800' 
          : params.value === 'inactive'
          ? 'bg-gray-100 text-gray-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {params.value || 'active'}
      </span>
    )
  },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const { data: users, isError, isLoading } = useGetUsersQuery();

  // Add mock status to users
  const usersWithStatus = users?.map(user => ({
    ...user,
    status: Math.random() > 0.7 ? 'inactive' : 'active',
    lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: Math.floor(Math.random() * 10),
    totalSpent: Math.floor(Math.random() * 1000) + 100,
  })) || [];

  // Filter users based on search term and filters
  const filteredUsers = usersWithStatus.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" || user.status === selectedStatus;
    
    const matchesRole = 
      selectedRole === "all" || user.role === selectedRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate user statistics
  const totalUsers = usersWithStatus.length;
  const activeUsers = usersWithStatus.filter(user => user.status === 'active').length;
  const inactiveUsers = usersWithStatus.filter(user => user.status === 'inactive').length;
  const adminUsers = usersWithStatus.filter(user => user.role === 'admin').length;
  const regularUsers = totalUsers - adminUsers;
  
  // Calculate total revenue
  const totalRevenue = usersWithStatus.reduce((sum, user) => sum + user.totalSpent, 0);
  
  // Find most active user
  const mostActiveUser = usersWithStatus.reduce((max, user) => 
    user.totalPurchases > max.totalPurchases ? user : max, 
    usersWithStatus[0] || { name: 'None', totalPurchases: 0 }
  );

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !users) {
    return (
      <div className="text-center text-red-500 py-4">Failed to fetch users</div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Header name="Customer Management" />
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your customers
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <UserPlus className="w-5 h-5 mr-2" /> Add Customer
          </button>
          <button
            className="flex items-center bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 border border-gray-200"
          >
            <Download className="w-5 h-5 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {activeUsers} active, {inactiveUsers} inactive
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">${totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">
                From all customer purchases
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Most Active</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">{mostActiveUser.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {mostActiveUser.totalPurchases} purchases
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recent Activities</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{mockActivities.length}</h3>
              <p className="text-xs text-gray-500 mt-1">
                In the last 30 days
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                <Search className="w-5 h-5 text-gray-400 m-2" />
                <input
                  className="w-full py-2 px-4 rounded-lg bg-transparent focus:outline-none"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button 
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 ml-2">
              <button
                className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setViewMode('table')}
              >
                <UsersIcon className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setViewMode('cards')}
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                defaultValue="name"
              >
                <option value="name">Name</option>
                <option value="recent">Most Recent</option>
                <option value="purchases">Most Purchases</option>
                <option value="spent">Highest Spent</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className={`${viewMode === 'cards' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-lg font-semibold mb-4">Customers</h3>
            {viewMode === 'cards' ? (
      <DataGrid
                rows={filteredUsers}
        columns={columns}
        getRowId={(row) => row.userId}
                autoHeight
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                className="rounded-lg"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          user.role === 'admin' 
                            ? 'bg-purple-100' 
                            : 'bg-blue-100'
                        }`}>
                          <User className={`w-5 h-5 ${
                            user.role === 'admin' 
                              ? 'text-purple-600' 
                              : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <span className={`text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'text-purple-600' 
                              : 'text-blue-600'
                          }`}>
                            {user.role || 'User'}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm">{user.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{user.address || 'No address'}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Purchases</p>
                          <p className="text-lg font-semibold text-gray-900">{user.totalPurchases}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Spent</p>
                          <p className="text-lg font-semibold text-green-600">${user.totalSpent.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        {viewMode === 'cards' && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${
                      activity.type === 'purchase' 
                        ? 'bg-green-100' 
                        : activity.type === 'support'
                        ? 'bg-blue-100'
                        : 'bg-amber-100'
                    }`}>
                      {activity.type === 'purchase' ? (
                        <CheckCircle className={`w-5 h-5 ${
                          activity.type === 'purchase' 
                            ? 'text-green-600' 
                            : activity.type === 'support'
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`} />
                      ) : activity.type === 'support' ? (
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Star className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
