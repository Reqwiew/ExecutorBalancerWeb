"use client";
import {useEffect, useState} from "react";

export default function WebSocketLog({url, title}) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLogs((prev) => [data, ...prev.slice(0, 49)]);
            } catch (e) {
                console.error("Ошибка парсинга сообщения:", e);
            }
        };

        ws.onclose = () => console.log(`WebSocket закрыт: ${url}`);
        ws.onerror = (err) => console.error("Ошибка WebSocket:", err);

        return () => ws.close();
    }, [url]);

    const isDispatch = title.toLowerCase().includes("dispatch");

    const formatTime = (input) => {
        if (!input) return new Date().toLocaleString("ru-RU");

        const date = new Date(input);
        if (isNaN(date.getTime())) return input;

        return date.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <div className=" w-full flex flex-col items-left max-h-[400px] min-h-[200px] lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-[#FF7A00] text-left">{title}</h2>

            <div className="space-y-4 w-full max-h-[320px] overflow-y-auto pr-2">
                {logs.length === 0 && (
                    <p className="text-gray-400 text-center">Нет данных...</p>
                )}

                {logs.map((log, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition"
                    >
                        <p className="text-gray-900 font-medium">
                            {log.id || log.request_id || "—"}
                        </p>

                        {!isDispatch ? (
                            <>
                                {log.status != null && log.status !== "" && (
                                    <p className="text-gray-700">
                                        Статус:{" "}
                                        <span className="font-semibold text-gray-900">{log.status}</span>
                                    </p>
                                )}
                                <p className="text-gray-500 text-sm">
                                    Отправлено в:{" "}
                                    {formatTime(
                                        log.timestamp || log.sent_at || new Date().toLocaleTimeString()
                                    )}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-700">
                                    Отправлено:{" "}
                                    <span className="font-semibold text-gray-900">
                    {log.dispatched_to || log.driver || "—"}
                  </span>
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Получено в:{" "}
                                    {log.received_at || new Date().toLocaleTimeString()}
                                </p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
