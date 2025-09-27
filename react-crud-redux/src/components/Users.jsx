import React, { useState, useEffect } from 'react';
import { Search, Plus, Grid2x2 as Grid, List } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
  fetchUsers,
  setSearchTerm,
  setCurrentPage,
  setViewMode,
  createUser,
  updateUser,
  deleteUser,
  clearError,
} from '../store/usersSlice';
import Header from './Header';
import UserTable from './UserTable';
import UserCards from './UserCards';
import UserModal from './UserModal';
import DeleteModal from './DeleteModal';
import Pagination from './Pagination';

const Users = () => {
  const dispatch = useAppDispatch();
  const {
    filteredUsers,
    searchTerm,
    currentPage,
    totalPages,
    viewMode,
    loading,
    error,
  } = useAppSelector((state) => state.users);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create',
    user: null,
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    user: null,
  });

  // Fetch users on component mount and page change
  useEffect(() => {
    dispatch(fetchUsers(currentPage));
  }, [dispatch, currentPage]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  const handleCreateUser = () => {
    setModalState({ isOpen: true, mode: 'create', user: null });
  };

  const handleEditUser = (user) => {
    setModalState({ isOpen: true, mode: 'edit', user });
  };

  const handleDeleteUser = (user) => {
    setDeleteState({ isOpen: true, user });
  };

  const handleModalSubmit = async (data) => {
    try {
      if (modalState.mode === 'create') {
        await dispatch(createUser(data)).unwrap();
      } else {
        await dispatch(updateUser(data)).unwrap();
      }
      setModalState({ isOpen: false, mode: 'create', user: null });
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteState.user) {
      try {
        await dispatch(deleteUser(deleteState.user.id)).unwrap();
        setDeleteState({ isOpen: false, user: null });
      } catch (err) {
        // Error is handled by the slice
      }
    }
  };

  if (loading && filteredUsers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Users</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Input search text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={handleCreateUser}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create User
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={() => handleViewModeChange('table')}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors duration-200 ${
                viewMode === 'table'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </button>
            <button
              onClick={() => handleViewModeChange('card')}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors duration-200 ${
                viewMode === 'card'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4 mr-1" />
              Card
            </button>
          </div>
        </div>

        {filteredUsers.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <UserTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ) : (
              <UserCards
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {loading && filteredUsers.length > 0 && (
          <div className="text-center py-4">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}
      </div>

      <UserModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create', user: null })}
        onSubmit={handleModalSubmit}
        user={modalState.user}
        mode={modalState.mode}
      />

      <DeleteModal
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false, user: null })}
        onConfirm={handleDeleteConfirm}
        userName={deleteState.user ? `${deleteState.user.first_name} ${deleteState.user.last_name}` : ''}
      />
    </div>
  );
};

export default Users;