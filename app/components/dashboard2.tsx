"use client";

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const UserDashboard = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Запросы",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar" as const,
        height: 500,
      },
      xaxis: {
        categories: [],
        labels: {
          rotate: -45,
        },
      },
      yaxis: {
        title: {
          text: "Количество запросов",
        },
      },
      tooltip: {
        y: {
          formatter: (val: string) => val,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
        },
      },
    },
  });

  useEffect(() => {
    fetch("https://ais.twc1.net/api/users/dispatched/")
      .then((res) => res.json())
      .then((data) => {
        const usernames = data.map((user: any) => user.username);
        const requests = data.map((user: any) => user.request_count);

        setChartData((prev) => ({
          ...prev,
          series: [
            {
              name: "Запросы",
              data: requests,
            },
          ],
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: usernames,
            },
          },
        }));
      })
      .catch((err) => console.error("Ошибка при загрузке данных:", err));
  }, []);

  return (
    <div>
      // @ts-ignore
      <Chart options={chartData.options} series={chartData.series} type="bar" height={500} />
    </div>
  );
};

export default UserDashboard;
