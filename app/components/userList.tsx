"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import Image from "next/image";
import delet from "@/app/assets/delete.svg";

interface User {
  id: string;
  first_name: string;
  last_name?: string;
  username: string;
  max_daily_requests: number;
  params: Record<string, any>;
}

interface DispatchedData {
  id: string;
  username: string;
  request_count: number;
  requests: { id: string; status: string }[];
}
interface UsersListProps {
  refreshTrigger?: number;
}
export default function UsersList({ refreshTrigger }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const [newParamKey, setNewParamKey] = useState("");
  const [newParamValue, setNewParamValue] = useState("");
  const [dispatched, setDispatched] = useState<DispatchedData | null>(null);
  const [loadingDispatched, setLoadingDispatched] = useState(false);


  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("https://ais.twc1.net/api/users", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setUsers(data);
        setError(null);
      } catch (err: any) {
        console.error("Ошибка загрузки пользователей:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [refreshTrigger]);

    const toggleUserParams = async (id: string) => {
    if (openUserId === id) {
      setOpenUserId(null);
      setDispatched(null);
      return;
    }

    setOpenUserId(id);
    setNewParamKey("");
    setNewParamValue("");

    setLoadingDispatched(true);
    try {
      const res = await fetch(`https://ais.twc1.net/api/users/${id}/dispatched-requests/`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      setDispatched(data);
    } catch (err: any) {
      console.error("Ошибка загрузки заявок:", err);
      setDispatched(null);
    } finally {
      setLoadingDispatched(false);
    }
  };

  const handleAddParam = async (user: User) => {
    if (!newParamKey) return;
    const updatedParams = { ...user.params, [newParamKey]: newParamValue };

    try {
      const res = await fetch(`https://ais.twc1.net/api/users/${user.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...user,
          params: updatedParams,
        }),
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const updatedUser = await res.json();
      setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? updatedUser : u))
      );
      setNewParamKey("");
      setNewParamValue("");
    } catch (err: any) {
      console.error("Ошибка обновления параметров:", err);
      alert(`Ошибка: ${err.message}`);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить этого пользователя?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://ais.twc1.net/api/users/${id}/`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);

      setUsers((prev) => prev.filter((user) => user.id !== id));
      if (openUserId === id) {
        setOpenUserId(null);
        setDispatched(null);
      }
    } catch (err: any) {
      console.error("Ошибка удаления пользователя:", err);

    }
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
      <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-6 bg-transparent rounded-2xl p-6 min-h-0">
        <div className="flex flex-col min-h-0 bg-white rounded-2xl p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#FF7A00]">
            Исполнители
          </h2>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
            {users.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Нет пользователей...
                </p>
            ) : (
                users.map((user) => (
                    <div
                        key={user.id}
                        className={`rounded-lg transition-colors border ${
                            openUserId === user.id
                                ? "bg-orange-50 border-orange-300"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        }`}
                    >
                      <div
                          className="grid grid-cols-5 items-center gap-4 w-full p-4 cursor-pointer"
                          onClick={() => toggleUserParams(user.id)}
                      >

                        <div className="col-span-3">
                          <p className="text-gray-900 font-medium">
                            {user.first_name} {user.last_name || ""}
                          </p>
                          <div className="flex items-center gap-4 text-gray-600 text-sm mt-1">
                            <span>@{user.username}</span>
                            <span>ID {user.id}</span>
                          </div>

                        </div>
                        <div>
                          <button
                              type="button"
                              className="ml-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id);
                              }}
                          >
                            <Image src={delet} alt="delete" width={24} height={24}/>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 ">
                          <p className="text-gray-700 font-medium">
                            {user.max_daily_requests}
                          </p>
                          {openUserId === user.id ? (
                              <ChevronUp className="text-gray-600" size={20}/>
                          ) : (
                              <ChevronDown className="text-gray-600" size={20}/>
                          )}
                        </div>
                      </div>

                      {openUserId === user.id && (
                          <div
                              className="px-6 pb-4 text-sm text-gray-700 border-t border-gray-200 bg-white rounded-b-lg">
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              {Object.entries(user.params || {}).map(([key, value]) => (
                                  <div
                                      key={key}
                                      className="flex justify-between bg-gray-50 px-3 py-1 rounded-md shadow-sm"
                                  >
                                    <span className="font-medium text-gray-600">{key}:</span>
                                    <span className="text-gray-900">
                            {typeof value === "boolean"
                                ? value
                                    ? "true"
                                    : "false"
                                : value}
                          </span>
                                  </div>
                              ))}
                            </div>

                            <div className="flex gap-2 mt-4">
                              <input
                                  type="text"
                                  placeholder="Ключ"
                                  value={newParamKey}
                                  onChange={(e) => setNewParamKey(e.target.value)}
                                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                              />
                              <input
                                  type="text"
                                  placeholder="Значение"
                                  value={newParamValue}
                                  onChange={(e) => setNewParamValue(e.target.value)}
                                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                              />
                              <button
                                  onClick={() => handleAddParam(user)}
                                  className="bg-[#FF7A00] text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-[#e66f00]"
                              >
                                <Plus size={16} /> Добавить
                              </button>
                            </div>
                          </div>
                      )}
                    </div>
                ))
            )}
          </div>
        </div>

        {openUserId && (
            <div className="flex flex-col min-h-0 bg-white rounded-2xl p-4 shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-[#FF7A00]">
                Заявки исполнителя
              </h3>

              {loadingDispatched ? (
                  <p className="text-gray-500 animate-pulse">Загрузка заявок...</p>
              ) : dispatched ? (
                  <>
                    <div className="text-sm text-gray-700 mb-3">
                      <p>
                        Пользователь:{" "}
                        <span className="font-medium">@{dispatched.username}</span>
                      </p>
                      <p>
                        Всего заявок:{" "}
                        <span className="font-medium">
                    {dispatched.request_count}
                  </span>
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
                      {dispatched.requests.map((req) => (
                          <div
                              key={req.id}
                              className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                    <span className="text-gray-800 font-mono text-sm">
                      {req.id}
                    </span>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                    req.status === "processed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                      {req.status}
                    </span>
                          </div>
                      ))}
                    </div>
                  </>
              ) : (
                  <p className="text-gray-400">Нет данных о заявках.</p>
              )}
            </div>
        )}
      </div>
  );
}
