'use client';
import React, { useState } from "react";
import Chart from "react-apexcharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import data from "./data.json";

const RequestsDashboard = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");

  const chartInfo = data.chart[period];

  const chartConfig: any = {
    series: [{ name: data.chart.title, data: chartInfo.values }],
    chart: { type: "area", height: 310, toolbar: { show: false } },
    colors: ["#007bff"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: chartInfo.labels },
    grid: { borderColor: "rgba(0,0,0,0.05)" },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox title="Всего заявок" value={data.stats.totalRequests} />
        <StatBox title="Заявок обработано" value={data.stats.processedRequests} />
        <StatBox title="Заявок завершено" value={data.stats.completedRequests} />
        <StatBox title="Кол-во исполнителей" value={data.stats.performers} />
      </div>

      <div className="col-span-3 bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-orange-500">
            {data.chart.title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod("week")}
              className={`px-4 py-1 rounded-full text-sm ${
                period === "week"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Неделя
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-4 py-1 rounded-full text-sm ${
                period === "month"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Месяцы
            </button>
          </div>
        </div>

        <Chart
          options={chartConfig}
          series={chartConfig.series}
          type="area"
          height="310px"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center">
        <h4 className="text-orange-500 font-semibold mb-4 text-2xl">Нагрузка исполнителей</h4>
        <div className="w-28 h-28">
          <CircularProgressbar
            value={data.stats.load}
            text={`${data.stats.load}%`}
            styles={buildStyles({
              textColor: "#007bff",
              pathColor: "#007bff",
              trailColor: "#e6e6e6",
              textSize: "50px",
            })}
          />
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-2xl p-4 text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-semibold mt-1">{value}</h3>
  </div>
);

export default RequestsDashboard;
