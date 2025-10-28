"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUserId, setOpenUserId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://ais.twc1.net/api/users", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Ошибка загрузки пользователей:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const toggleUserParams = (id) => {
    setOpenUserId(openUserId === id ? null : id);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-500 animate-pulse">Загрузка пользователей...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-medium">
        Ошибка: {error}
      </div>
    );

  return (
    <div className="bg-transparent rounded-2xl p-6 h-[400px] flex flex-col min-h-0">
      <h2 className="text-xl font-semibold mb-4 text-[#FF7A00]">
        Исполнители
      </h2>

      <div className="flex-1 bg-white overflow-y-auto min-h-0 space-y-3 pr-2 rounded-lg">
        {users.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Нет пользователей...</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between p-4 cursor-pointer"
                   onClick={() => toggleUserParams(user.id)}>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {user.first_name} {user.last_name || ""}
                  </p>
                  <div className="flex items-center gap-4 text-gray-600 text-sm mt-1">
                    <span>@{user.username}</span>
                    <span>ID{user.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-700 font-medium">{user.max_daily_requests}</p>
                  {openUserId === user.id ? (
                    <ChevronUp className="text-gray-600" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-600" size={20} />
                  )}
                </div>
              </div>

              {/* Дропдаун с params */}
              {openUserId === user.id && (
                <div className="px-6 pb-4 text-sm text-gray-700 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {Object.entries(user.params || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between bg-white px-3 py-1 rounded-md shadow-sm"
                      >
                        <span className="font-medium text-gray-600">{key}:</span>
                        <span className="text-gray-900">
                          {typeof value === "boolean" ? (value ? "true" : "false") : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
