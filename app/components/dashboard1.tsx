'use client';
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const RequestsDashboard = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async (selectedPeriod: "week" | "month") => {
    setLoading(true);
    try {
      const response = await fetch(`https://ais.twc1.net/core/stats/?period=${selectedPeriod}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Ошибка загрузки статистики");

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);


 useEffect(() => {

    fetchStats(period);


    const intervalId = setInterval(() => {
      fetchStats(period);
    }, 10000);


    return () => clearInterval(intervalId);
  }, [period]);

if (!data) {
  return <div className="p-6 text-center text-gray-500"></div>;
}
  const chartInfo = data.chart;

  const chartConfig: any = {
    series: [{name: "Количество заявок", data: chartInfo.values }],
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
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
      categories: chartInfo.labels,
      labels: { style: { fontSize: "14px", fontWeight: "bold" } },
    },
    yaxis: { labels: { style: { fontSize: "12px", fontWeight: "bold" } } },
    grid: { borderColor: "rgba(0,0,0,0.05)" },
  };


const getPeriodDates = (period: "week" | "month") => {
  const today = new Date();
  let start = new Date(today);
  let end = new Date(today);

  if (period === "week") {
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(today.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "month") {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return {
    start_date: formatDate(start),
    end_date: formatDate(end)
  };
};

const downloadExcel = () => {
  const { start_date, end_date } = getPeriodDates(period);
  const url = `https://ais.twc1.net/export/logs?start_date=${start_date}&end_date=${end_date}`;
  window.open(url, '_blank');
};
  return (
    <div className="w-full lg:p-6 rounded-2xl">
      <div className="grid grid-cols-2 gap-2 justify-center mb-6 lg:grid-cols-4">
        <StatBox title="Всего заявок" value={data.stats.totalRequests} />
        <StatBox title="Заявок обработано" value={data.stats.processedRequests} />
        <StatBox title="Принято" value={data.stats.acceptedRequests} />
        <StatBox title="Исполнителей" value={data.stats.performers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="col-span-4 bg-white rounded-2xl p-6">
          <div className="flex flex-col items-start gap-4 mb-4">
            <h3 className="text-2xl font-semibold text-orange-500">Пик заявок</h3>
            <div className="flex gap-4 lg:gap-12">
              <button
                onClick={() => setPeriod("week")}
                className={`px-4 py-1 rounded-full border border-orange-500 text-sm transition ${
                  period === "week"
                    ? "bg-orange-500 text-white"
                    : "text-orange-500 bg-transparent"
                }`}
              >
                Неделя
              </button>
              <button
                onClick={() => setPeriod("month")}
                className={`px-4 py-1 rounded-full border border-orange-500 text-sm transition ${
                  period === "month"
                    ? "bg-orange-500 text-white"
                    : "text-orange-500 bg-transparent"
                }`}
              >
                Месяц
              </button>
            </div>
          </div>

          <Chart options={chartConfig} series={chartConfig.series} type="area" />
          <div className="flex justify-center mt-6">
            <button className="bg-orange-500 text-white px-10 py-2 rounded-full font-medium text-sm hover:bg-orange-600 transition lg:px-48" onClick={downloadExcel}>
              Скачать отчет
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 col-span-4 flex flex-col mb-4 lg:col-span-2">
          <h4 className="text-orange-500 font-semibold mb-2 text-xl">Нагруженность исполнителей</h4>
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
                xaxis: { categories: ["", ""] },
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

          <div className="flex flex-col gap-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1 text-[#0066FF] ">
              <span className="w-2.5 h-2.5 bg-[#0066FF] rounded-full"></span>
              самый нагруженный
            </div>
            <div className="flex items-center gap-1 text-[#E240BE] ">
              <span className="w-2.5 h-2.5 bg-[#E240BE] rounded-full"></span>
              самый разгруженный
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-2xl w-4/5 h-24 l:p-4">
    <p className="text-[#919191] px-2 py-2 text-left font-bold text-sm l:text-cente">{title}</p>
    <h3 className="text-2xl text-black px-2 text-left font-semibold mt-1 l:text-center">{value}</h3>
  </div>
);

export default RequestsDashboard;
