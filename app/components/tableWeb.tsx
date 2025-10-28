"use client";

import React, { useEffect, useState } from "react";

interface RequestItem {
  type: string;
  request_id: string;
  user: string;
  timestamp: string;
}

const RealTimeRequestsTable: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://ais.twc1.net/ws/dispatched/");

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Проверяем тип события
        if (data.type === "request_dispatched") {
          setRequests((prev) => [data, ...prev]);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("⚠️ WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("💥 WebSocket error:", error);
    };

    // Очистка при размонтировании
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">
        Запросы в реальном времени
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID запроса
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Время
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <tr key={req.request_id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {req.request_id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    @{req.user}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(req.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                      Распределено
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  Нет данных...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealTimeRequestsTable;
