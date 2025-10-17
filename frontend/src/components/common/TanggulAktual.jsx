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
    Filler, // Import Filler plugin
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Register Filler plugin
);

const RiverDevelopmentChart = ({ stationData, className = "" }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "safe":
                return { text: "text-green-500", bg: "bg-green-500" };
            case "warning":
                return { text: "text-yellow-500", bg: "bg-yellow-500" };
            case "alert":
                return { text: "text-red-500", bg: "bg-red-500" };
            default:
                return { text: "text-gray-400", bg: "bg-gray-400" };
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "safe":
                return "Aman";
            case "warning":
                return "Waspada";
            case "alert":
                return "Bahaya";
            default:
                return "Normal";
        }
    };

    const chartData = useMemo(() => {
        const waterLevel = stationData?.value || 0.2;
        const leveeData = [
            { x: 0, y: 3.5 },
            { x: 1, y: 3.5 },
            { x: 2, y: 3.5 },
            { x: 3, y: 3.5 },
            { x: 4, y: 3.5 },
            { x: 5, y: 3.2 },
            { x: 6, y: 2.5 },
            { x: 7, y: 2 },
            { x: 8, y: 1 },
            { x: 9, y: 0.8 },
            { x: 10, y: 0.4 },
            { x: 11, y: 0.2 },
            { x: 12, y: 0.2 },
            { x: 13, y: 0.2 },
            { x: 14, y: 0.2 },
            { x: 15, y: 0.4 },
            { x: 16, y: 0.8 },
            { x: 17, y: 1 },
            { x: 18, y: 2 },
            { x: 19, y: 2.5 },
            { x: 20, y: 3.2 },
            { x: 21, y: 3.5 },
            { x: 22, y: 3.5 },
            { x: 23, y: 3.5 },
            { x: 24, y: 3.5 },
        ];

        const labels = leveeData.map((p) => p.x);

        return {
            labels,
            datasets: [
                {
                    label: "Level Air",
                    data: leveeData.map(() => waterLevel),
                    borderColor: "#4682B4",
                    backgroundColor: "rgba(135, 206, 235, 0.6)",
                    fill: {
                        target: { value: 0.2 },
                        above: "rgba(135, 206, 235, 0.6)",
                    },
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 0,
                },
                {
                    label: "Bingkai Tanggul",
                    data: leveeData.map((p) => p.y),
                    borderColor: "#9CA3AF",
                    backgroundColor: "rgba(209, 213, 219, 1)",
                    fill: "start",
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2,
                },
            ],
        };
    }, [stationData?.value]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                min: 0,
                max: 4,
                title: {
                    display: true,
                    text: "Tinggi Air (m)",
                },
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
        },
    };

    if (!stationData) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center h-[220px] flex items-center justify-center">
                <p className="text-lg font-medium text-gray-600">Tidak Ada Data</p>
            </div>
        );
    }

    const statusColors = getStatusColor(stationData.status);

    return (
        <div className={`bg-white rounded-xl shadow-sm ${className}`}>
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Perkembangan Air Sungai</h3>
                    <div
                        className={`flex items-center space-x-2 px-2 py-1 rounded-full ${statusColors.bg.replace(
                            "bg-",
                            "bg-opacity-10"
                        )}`}
                    >
                        <div className={`w-3 h-3 rounded-full ${statusColors.bg}`}></div>
                        <span className={`text-sm font-medium ${statusColors.text}`}>
                            {getStatusText(stationData.status)}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{stationData.location}</p>
            </div>
            <div className="px-2 pb-4 h-[220px]">
                <Line options={options} data={chartData} />
            </div>
        </div>
    );
};

export default RiverDevelopmentChart;
