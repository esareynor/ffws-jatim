import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonitoringChart = ({ actualData = [], predictedData = [], className = "" }) => {
    const chartData = useMemo(() => {
        const labels = actualData.map((_, index) => `T${index + 1}`);
        return {
            labels,
            datasets: [
                {
                    label: "Data Aktual",
                    data: actualData,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.5)",
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: "#3b82f6",
                },
                {
                    label: "Prediksi",
                    data: predictedData,
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.5)",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 3,
                    pointBackgroundColor: "#ef4444",
                },
            ],
        };
    }, [actualData, predictedData]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                            label += ": ";
                        }
                        if (context.parsed.y !== null) {
                            label += `${context.parsed.y.toFixed(2)}m`;
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Level Air (m)",
                },
            },
        },
    };

    if (actualData.length === 0) {
        return (
            <div className={`relative ${className}`}>
                <div className="bg-gray-50 rounded-lg p-8 text-center h-[320px] flex items-center justify-center">
                    <div className="text-gray-500 text-lg">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        <p className="text-lg font-medium text-gray-600">Tidak Ada Data</p>
                        <p className="text-sm text-gray-500 mt-2">Data monitoring akan ditampilkan di sini</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-[320px]">
                <Line options={options} data={chartData} />
            </div>
        </div>
    );
};

export default MonitoringChart;
