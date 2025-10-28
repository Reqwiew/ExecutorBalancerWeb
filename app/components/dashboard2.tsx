'use client';

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const UserDashboard = () => {
  const [chartData, setChartData] = useState({
    series: [{ name: "Запросы", data: [] as number[] }],
    options: {
      chart: { type: "bar" as const, height: 500 },
      xaxis: { categories: [] as string[], labels: { rotate: -45 } },
      yaxis: { title: { text: "Количество запросов" } },
      tooltip: { y: { formatter: (val: number) => val.toString() } },
      plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    },
  });

  useEffect(() => {
    const fetchData = () => {
      fetch("https://ais.twc1.net/api/users/dispatched/")
          .then((res) => res.json())
          .then((data) => {
            const sortedData = data.sort((a: any, b: any) =>
                a.username.localeCompare(b.username)
            );

            const usernames = sortedData.map((user: any) => user.username);
            const requests = sortedData.map((user: any) => user.request_count);

            setChartData((prev) => ({
              ...prev,
              series: [{ name: "Запросы", data: requests }],
              options: {
                ...prev.options,
                xaxis: { ...prev.options.xaxis, categories: usernames },
              },
            }));
          })
          .catch((err) => console.error("Ошибка при загрузке данных:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (chartData.series[0].data.length === 0) return <p>Загрузка данных...</p>;

  return (
      <div>
        <Chart options={chartData.options} series={chartData.series} type="bar" height={500} />
      </div>
  );
};

export default UserDashboard;
