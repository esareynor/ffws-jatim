import React, { useMemo } from "react";
// import { LineChart,Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';

/**
 * Komponen MonitoringChart untuk menampilkan data aktual dan prediksi
 * Digunakan di tab monitoring DetailPanel
 */
const MonitoringChart = ({
    actualData = [],
    predictedData = [],
    width = 640,
    height = 320,
    className = "",
    canvasId = "monitoring-chart",
}) => {
    // Generate predicted data jika tidak disediakan
    const predicted = useMemo(() => {
        if (predictedData.length > 0) return predictedData;

        return actualData.map((value, index) => {
            if (index === 0) return value;
            const prevValue = actualData[index - 1];
            const drift = (value - prevValue) * 0.6;
            return Math.max(0, value + drift);
        });
    }, [actualData, predictedData]);

    // Prepare data for Recharts
    const chartData = useMemo(() => {
        return actualData.map((value, index) => ({
            time: `T${index + 1}`,
            actual: value,
            predicted: predicted[index] || 0,
        }));
    }, [actualData, predicted]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-700">{`Waktu: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.dataKey}: ${entry.value.toFixed(2)}m`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Fallback jika tidak ada data
    if (actualData.length === 0) {
        return (
            <div className={`relative ${className}`}>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
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
            {/* Chart Container */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: "Level Air (m)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: "10px" }} />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                            name="Data Aktual"
                        />
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#ef4444"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                            activeDot={{ r: 5, stroke: "#ef4444", strokeWidth: 2 }}
                            name="Prediksi"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Chart Info */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="font-medium text-blue-800">Data Aktual</div>
                    <div className="text-blue-600">
                        {actualData.length > 0
                            ? `Terakhir: ${actualData[actualData.length - 1].toFixed(1)}m`
                            : "Tidak ada data"}
                    </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <div className="font-medium text-red-800">Prediksi</div>
                    <div className="text-red-600">
                        {predicted.length > 0
                            ? `Terakhir: ${predicted[predicted.length - 1].toFixed(1)}m`
                            : "Tidak ada data"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitoringChart;
