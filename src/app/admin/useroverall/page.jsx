'use client';

import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function UserTrustList() {
    const [users, setUsers] = useState([
        { name: 'ศิวกร', score: 100 },
        { name: 'User 2', score: 55 },
        { name: 'User 3', score: 90 },
        { name: 'jimmy', score: 100 },
        { name: 'User 5', score: 100 },
        { name: 'User 6', score: 100 },
        { name: 'User 7', score: 100 },
        { name: 'User 8', score: 50 },
    ]);

    const [bannedUsers, setBannedUsers] = useState([]);

    const isSidebarOpen = true;

    const handleBan = (name) => {
        setBannedUsers((prev) => [...prev, name]);
    };

    return (
        <div className="flex min-h-screen bg-black text-white">

            {/* ================= SIDEBAR ================= */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                incidents={[]}
                setSelectedIncident={() => {}}
                isLoggedIn={true}
            />

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 p-6">

                <h1 className="text-xl font-bold mb-6">
                    User Trust Score
                </h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user, index) => {
                        const isBanned = bannedUsers.includes(user.name);

                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border bg-gray-900 transition ${
                                    isBanned
                                        ? 'border-red-600 opacity-60'
                                        : 'border-gray-800'
                                }`}
                            >
                                {/* NAME */}
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="font-bold text-sm">
                                        {user.name}
                                    </h2>

                                    <span className="text-xs text-gray-400">
                                        {user.score}/100
                                    </span>
                                </div>

                                {/* PROGRESS BAR */}
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${
                                            user.score >= 80
                                                ? 'bg-green-500'
                                                : user.score >= 50
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                        }`}
                                        style={{ width: `${user.score}%` }}
                                    />
                                </div>

                                {/* STATUS */}
                                <p className="text-[11px] mt-2 text-gray-400">
                                    {user.score >= 80
                                        ? 'Trusted User'
                                        : user.score >= 50
                                        ? 'Medium Risk'
                                        : 'High Risk'}
                                </p>

                                {/* ================= BAN BUTTON ================= */}
                                {user.score <= 50 && !isBanned && (
                                    <button
                                        onClick={() => handleBan(user.name)}
                                        className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition"
                                    >
                                        🚫 Ban User
                                    </button>
                                )}

                                {/* BANNED LABEL */}
                                {isBanned && (
                                    <p className="mt-3 text-red-500 text-xs font-bold">
                                        ❌ BANNED
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}