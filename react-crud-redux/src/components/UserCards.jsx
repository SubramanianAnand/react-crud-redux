import React from 'react';
import { CreditCard as Edit2, Pencil, Trash2 } from 'lucide-react';

const UserCards = ({ users, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <div key={user.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="p-6 text-center relative">
            <img
              className="w-20 h-20 rounded-full mx-auto mb-4"
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/80x80?text=?';
              }}
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{user.email}</p>
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(user)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCards;