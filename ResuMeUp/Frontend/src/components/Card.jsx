
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const ProfileInfoCard = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();



    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <div
            className="flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-blue-900/60 via-violet-900/60 to-black/60 border border-blue-500/20 rounded-2xl shadow-lg backdrop-blur-md hover:shadow-violet-400/20 transition-all duration-300"
            style={{ minWidth: 220 }}
        >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md">
                <span className="text-xl font-black text-white select-none">
                    {getInitials(user.name)}
                </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold text-base text-blue-100 truncate max-w-[120px]">{user.name}</span>
                <span className="text-xs text-violet-300 truncate max-w-[120px]">{user.email}</span>
            </div>
            <div className="flex flex-col gap-1 ml-auto">
                {/* View Profile button removed for theme simplicity */}
                <button
                    className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-600 transition-colors px-2 py-1 rounded-lg"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};