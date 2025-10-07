import React, { useMemo } from "react";
// import {
//     AreaChart,
//     Area,
//     Line,
//     XAxis,
//     YAxis,
//     ResponsiveContainer,
//     Tooltip,
//     CartesianGrid,
//     ReferenceLine,
//     Legend,
// } from "recharts";

/*Komponen untuk menampilkan perkembangan air sungai aktual*/
const RiverDevelopmentChart = ({ stationData, chartHistory = [], width = 560, height = 220, className = "w-full" }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "safe":
                return "text-green-500";
            case "warning":
                return "text-yellow-500";
            case "alert":
                return "text-red-500";
            default:
                return "text-gray-400";
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

    if (!stationData) {
        return (
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
                    <p className="text-sm text-gray-500 mt-2">Data perkembangan air sungai akan ditampilkan di sini</p>
                </div>
            </div>
        );
    }

    const chartData = useMemo(() => {
        const waterLevel = stationData.value || 0.2; // Default 0.2m

        // Data tanggul V-shape
        const leveeData = [
            { x: 0, levee: 3.5 }, // Puncak kiri
            { x: 1, levee: 3.5 }, // Puncak kiri
            { x: 2, levee: 3.5 }, // Puncak kiri
            { x: 3, levee: 3.5 }, // Puncak kiri
            { x: 4, levee: 3.5 }, // Puncak kiri
            { x: 5, levee: 3.2 }, // Mulai miring landai
            { x: 6, levee: 2.5 }, // Sisi miring landai
            { x: 7, levee: 2 }, // Sisi miring landai
            { x: 8, levee: 1 }, // Sisi miring landai
            { x: 9, levee: 0.8 }, // Sisi miring landai
            { x: 10, levee: 0.4 }, // Dasar sungai
            { x: 11, levee: 0.2 }, // Dasar sungai
            { x: 12, levee: 0.2 }, // Dasar sungai
            { x: 13, levee: 0.2 }, // Dasar sungai
            { x: 14, levee: 0.2 }, // Dasar sungai
            { x: 15, levee: 0.4 }, // Dasar sungai
            { x: 16, levee: 0.8 }, // Sisi miring landai
            { x: 17, levee: 1 }, // Sisi miring landai
            { x: 18, levee: 2 }, // Sisi miring landai
            { x: 19, levee: 2.5 }, // Sisi miring landai
            { x: 20, levee: 3.2 }, // Mulai miring landai
            { x: 21, levee: 3.5 }, // Puncak kanan
            { x: 22, levee: 3.5 }, // Puncak kanan
            { x: 23, levee: 3.5 }, // Puncak kanan
            { x: 24, levee: 3.5 }, // Puncak kanan
        ];

        // Data dengan level air konstan (muka air rata)
        const data = leveeData.map((point) => {
            return {
                x: point.x,
                levee: point.levee,
                water: waterLevel, // Nilai konstan untuk muka air rata
            };
        });

        console.log("TanggulAktual chartData (muka air rata):", data); // Debug log
        return data;
    }, [stationData.value]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const waterLevel = stationData.value || 0.2;
            const leveePayload = payload.find((p) => p.name === "Bingkai Tanggul");
            const leveeValue = leveePayload ? leveePayload.value : null;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-700">Level Air: {waterLevel.toFixed(2)}m</p>
                    {leveeValue !== null && (
                        <p className="text-sm text-gray-600">Tinggi Tanggul: {leveeValue.toFixed(2)}m</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm ${className}`}>
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Perkembangan Air Sungai Aktual</h3>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            <div
                                className={`w-3 h-3 rounded-full ${getStatusColor(stationData.status).replace(
                                    "text-",
                                    "bg-"
                                )}`}
                            ></div>
                            <span className={`text-sm font-medium ${getStatusColor(stationData.status)}`}>
                                {getStatusText(stationData.status)}
                            </span>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{stationData.location}</p>
            </div>
            <div className="px-6 pb-6">
                <div style={{ width: "100%", height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 80, left: 60, bottom: 20 }}>
                            <defs>
                                <linearGradient id="leveeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#E5E7EB" />
                                    <stop offset="50%" stopColor="#D1D5DB" />
                                    <stop offset="100%" stopColor="#9CA3AF" />
                                </linearGradient>
                                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#87CEEB" stopOpacity={0.9} />
                                    <stop offset="50%" stopColor="#87CEEB" stopOpacity={0.7} />
                                    <stop offset="100%" stopColor="#4682B4" stopOpacity={0.5} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="2 2" stroke="#ffffff" strokeOpacity={0.8} />
                            <XAxis dataKey="x" hide={true} domain={[0, 24]} />
                            <YAxis
                                domain={[0, 4]}
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                label={{ value: "Tinggi Air (m)", angle: -90, position: "insideLeft" }}
                            />

                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: "10px" }} />

                            {/* Area visual air berwarna biru - muka air rata tanpa outline */}
                            <Area
                                type="monotone"
                                dataKey="water"
                                fill="url(#waterGradient)"
                                fillOpacity={0.6}
                                stroke="none" // Menghilangkan outline
                                strokeWidth={0} // Menghilangkan ketebalan outline
                                name="Level Air"
                            />

                            {/* Area tanggul (abu-abu) dengan sisi miring landai */}
                            <Area
                                type="monotone"
                                dataKey="levee"
                                fill="url(#leveeGradient)"
                                fillOpacity={1}
                                stroke="#9CA3AF"
                                strokeWidth={2}
                                name="Bingkai Tanggul"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RiverDevelopmentChart;
