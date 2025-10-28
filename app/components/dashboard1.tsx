'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Period = "hours" | "week" | "month";

const RequestsDashboard: React.FC = () => {
    const [period, setPeriod] = useState<Period>("hours");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const chartRef = useRef<any>(null);

    const fetchStats = async (selectedPeriod: Period) => {
        try {
            const res = await fetch(`https://ais.twc1.net/core/stats/?period=${selectedPeriod}`);
            if (!res.ok) throw new Error("Ошибка загрузки статистики");
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initialFetch = async () => {
            setLoading(true);
            await fetchStats(period);
            if (isMounted) {
                setLoading(false);
            }
        };

        initialFetch();

        const interval = setInterval(() => {
            fetchStats(period);
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [period]);

    const chartOptions = useMemo<ApexOptions>(() => ({
        chart: {
            type: "area",
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
            responsive: [
                { breakpoint: 1024, options: { chart: { height: 280 } } },
                { breakpoint: 768, options: { chart: { height: 240 } } },
                { breakpoint: 480, options: { chart: { height: 140 } } },
            ],
        },
        colors: ["#00aaff"],
        stroke: { curve: "smooth", width: 0 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                gradientToColors: ["#00aaff"],
                opacityFrom: 0.6,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
        dataLabels: { enabled: false },
        markers: { size: 3, colors: ["#FF7A00"], strokeColors: "#fff", strokeWidth: 2 },
        xaxis: {
            categories: data?.chart?.labels || [],
            title: {
                text:
                    period === "hours"
                        ? "Время (часы)"
                        : period === "week"
                            ? "Дни недели"
                            : "Дни месяца",
                style: { fontWeight: "bold" },
            },
            labels: { style: { fontSize: "12px", fontWeight: "bold" } },
        },
        yaxis: {
            title: {
                text: "Количество заявок",
                style: { fontWeight: "bold", fontSize: "14px" },
            },
            labels: { style: { fontSize: "12px", fontWeight: "bold" } },
        },
        grid: { borderColor: "rgba(0,0,0,0.05)" },
    }), [data, period]);

    const getPeriodDates = (period: Period) => {
        const today = new Date();
        let start = new Date(today);
        let end = new Date(today);

        if (period === "hours") {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        } else if (period === "week") {
            const day = today.getDay();
            const diff = day === 0 ? 6 : day - 1;
            start.setDate(today.getDate() - diff);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        } else {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }

        const formatDate = (d: Date) => d.toISOString().split("T")[0];
        return { start_date: formatDate(start), end_date: formatDate(end) };
    };

    const downloadExcel = () => {
        if (typeof window === "undefined") return;
        const { start_date, end_date } = getPeriodDates(period);
        const url = `https://ais.twc1.net/export/logs?start_date=${start_date}&end_date=${end_date}`;
        window.open(url, "_blank");
    };

    if (!data || loading) return <p>Загрузка...</p>;

    return (
        <div className="w-full lg:p-6 rounded-2xl">

            <div className="grid grid-cols-2 gap-2 justify-center mb-6 lg:grid-cols-4">
                <StatBox title="Всего заявок" value={data.stats.totalRequests}/>
                <StatBox title="Заявок обработано" value={data.stats.processedRequests}/>
                <StatBox title="Медиана" value={data.stats.medianBetweenMaxMin}/>
                <StatBox title="Исполнителей" value={data.stats.performers}/>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">

                <div className="col-span-4 bg-white rounded-2xl p-6">
                    <div className="flex flex-col items-start gap-4 mb-4">
                        <h3 className="text-2xl font-semibold text-orange-500">Пик заявок</h3>
                        <div className="flex gap-4 lg:gap-12">
                            {["hours", "week", "month"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p as Period)}
                                    className={`px-4 py-1 rounded-full border border-orange-500 text-sm transition ${
                                        period === p
                                            ? "bg-orange-500 text-white"
                                            : "text-orange-500 bg-transparent"
                                    }`}
                                >
                                    {p === "hours" ? "День" : p === "week" ? "Неделя" : "Месяц"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative" style={{ height: 350 }}>
                        <Chart
                            options={chartOptions}
                            series={[{ name: "Количество заявок", data: data.chart.values }]}
                            type="area"
                            height="100%"
                        />
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            className="bg-orange-500 text-white px-10 py-2 rounded-full font-medium text-sm hover:bg-orange-600 transition lg:px-48"
                            onClick={downloadExcel}
                        >
                            Скачать отчет
                        </button>
                    </div>
                </div>


                <div className="bg-white rounded-2xl p-6 col-span-4 flex flex-col mb-4 lg:col-span-2">
                    <h4 className="text-orange-500 font-semibold mb-2 text-xl">
                        Нагруженность исполнителей
                    </h4>
                    <p className="text-gray-500 text-sm mb-4">
                        Погрешность{" "}
                        <span className="text-orange-500 font-semibold">{data.workload.error}</span>
                    </p>

                    <div className="flex-1 flex items-center justify-center">
                        <Chart
                            type="bar"
                            height={400}
                            options={{
                                chart: { toolbar: { show: false } },
                                plotOptions: {
                                    bar: { columnWidth: "40%", borderRadius: 6, distributed: true },
                                },
                                xaxis: { categories: ["Макс.", "Мин."] },
                                colors: ["#0066FF", "#E240BE"],
                                dataLabels: { enabled: false },
                                legend: { show: false },
                                yaxis: {
                                    title: {
                                        text: "Кол-во заявок",
                                        style: { fontWeight: "normal", fontSize: "14px" },
                                    },
                                },
                                grid: { borderColor: "rgba(0,0,0,0.05)" },
                            }}
                            series={[{ name: "Заявки", data: [data.workload.max, data.workload.min] }]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ title, value }: { title: string; value: number }) => (
    <div className="bg-white rounded-2xl w-4/5 h-24 p-4">
        <p className="text-[#919191] px-2 py-2 text-left font-bold text-sm">{title}</p>
        <h3 className="text-2xl text-black px-2 text-left font-semibold mt-1">{value}</h3>
    </div>
);

export default RequestsDashboard;
