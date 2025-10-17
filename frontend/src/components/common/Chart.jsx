import React, { memo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

const Chart = ({ data = [], status = "safe", className = "" }) => {
    const getLineColor = () => {
        switch (status) {
            case "safe":
                return "#10B981";
            case "warning":
                return "#F59E0B";
            case "alert":
                return "#EF4444";
            default:
                return "#6B7280";
        }
    };

    const chartData = {
        labels: data.map((_, i) => i),
        datasets: [
            {
                data: data,
                borderColor: getLineColor(),
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
                    const color = getLineColor();
                    gradient.addColorStop(0, `${color}80`); // 50% opacity
                    gradient.addColorStop(1, `${color}00`); // 0% opacity
                    return gradient;
                },
                fill: true,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
            },
        ],
    };

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
                display: false,
            },
        },
    };

    return (
        <div className={`relative ${className}`} style={{ width: "48px", height: "22px" }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default memo(Chart);
