"use client";

import { useState, useEffect } from "react";
import { useGetUsersQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { 
  User as UserIcon, 
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

interface User {
  userId: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
  phone?: string;
  address?: string;
  lastActivity?: string;
  totalPurchases?: number;
  totalSpent?: number;
}

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
  { field: "name", headerName: "Name", width: 130 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "role", headerName: "Role", width: 100 },
  { field: "status", headerName: "Status", width: 100 },
  { field: "phone", headerName: "Phone", width: 130 },
  { field: "address", headerName: "Address", width: 200 },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const { data: users, isError, isLoading } = useGetUsersQuery();

  // Add effect to check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check initial screen size
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Add mock status to users
  const usersWithStatus = users?.map(user => ({
    ...user,
    status: Math.random() > 0.7 ? 'inactive' : 'active',
    role: Math.random() > 0.8 ? 'admin' : 'user',
    lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: Math.floor(Math.random() * 10),
    totalSpent: Math.floor(Math.random() * 1000) + 100,
    phone: Math.random() > 0.5 ? '+1 234 567 8900' : undefined,
    address: Math.random() > 0.5 ? '123 Main St, City, Country' : undefined
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
    <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <Header name="Customer Management" />
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your customers
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Add Customer
          </button>
          <button
            className="flex items-center bg-white hover:bg-gray-50 text-gray-700 font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 border border-gray-200 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Customers</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{totalUsers}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {activeUsers} active, {inactiveUsers} inactive
              </p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mt-1">${totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">
                From all customer purchases
              </p>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Most Active</p>
              <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">{mostActiveUser.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {mostActiveUser.totalPurchases} purchases
              </p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Recent Activities</p>
              <h3 className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{mockActivities.length}</h3>
              <p className="text-xs text-gray-500 mt-1">
                In the last 30 days
              </p>
            </div>
            <div className="bg-amber-100 p-2 sm:p-3 rounded-lg">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 m-1.5 sm:m-2" />
                <input
                  className="w-full py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg bg-transparent focus:outline-none text-sm sm:text-base"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button 
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Filters
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                className={`p-1.5 sm:p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setViewMode('table')}
              >
                <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                className={`p-1.5 sm:p-2 rounded-lg ${viewMode === 'cards' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setViewMode('cards')}
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                className="w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Customers List */}
        <div className={`${viewMode === 'cards' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Customers</h3>
            {viewMode === 'table' ? (
              <div className="w-full overflow-x-auto">
                <DataGrid
                  rows={isMobile ? filteredUsers.slice(0, 5) : filteredUsers}
                  columns={columns}
                  getRowId={(row) => row.userId}
                  autoHeight
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  pageSizeOptions={[10]}
                  disableRowSelectionOnClick
                  className="rounded-lg"
                  sx={{
                    '& .MuiDataGrid-cell': {
                      fontSize: '0.875rem',
                      '@media (min-width: 640px)': {
                        fontSize: '1rem',
                      },
                    },
                    '& .MuiDataGrid-columnHeader': {
                      fontSize: '0.875rem',
                      '@media (min-width: 640px)': {
                        fontSize: '1rem',
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {(isMobile ? filteredUsers.slice(0, 5) : filteredUsers).map((user) => (
                  <div
                    key={user.userId}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div className="flex items-center">
                        <div className={`p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 ${
                          user.role === 'admin' 
                            ? 'bg-purple-100' 
                            : 'bg-blue-100'
                        }`}>
                          <UserIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            user.role === 'admin' 
                              ? 'text-purple-600' 
                              : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{user.name}</h3>
                          <span className={`text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'text-purple-600' 
                              : 'text-blue-600'
                          }`}>
                            {user.role || 'User'}
                          </span>
                        </div>
                      </div>
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">{user.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">{user.address || 'No address'}</span>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Total Purchases</p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900">${user.totalPurchases || 0}</p>
                        </div>
                        <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {isMobile && filteredUsers.length > 5 && (
                  <div className="col-span-full flex justify-center mt-4">
                    <button
                      onClick={() => setViewMode('table')}
                      className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      <UsersIcon className="w-4 h-4 mr-2" />
                      View All Users
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        {viewMode === 'cards' && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activity</h3>
              <div className="space-y-3 sm:space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 ${
                      activity.type === 'purchase' 
                        ? 'bg-green-100' 
                        : activity.type === 'support'
                        ? 'bg-blue-100'
                        : 'bg-amber-100'
                    }`}>
                      {activity.type === 'purchase' ? (
                        <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          activity.type === 'purchase' 
                            ? 'text-green-600' 
                            : activity.type === 'support'
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`} />
                      ) : activity.type === 'support' ? (
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      ) : (
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                        <span className={`ml-2 px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium ${
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
