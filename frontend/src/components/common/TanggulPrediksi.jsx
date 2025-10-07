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

/**
 * Komponen untuk menampilkan prediksi banjir
 * Menggunakan LeveeChart dengan parameter dan threshold prediksi
 */
const PredictionChart = ({ stationData, chartHistory = [], width = 560, height = 220, className = "w-full" }) => {
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
                    <p className="text-sm text-gray-500 mt-2">Data prediksi banjir akan ditampilkan di sini</p>
                </div>
            </div>
        );
    }

    const chartData = useMemo(() => {
        const predictedWaterLevel = (stationData.value || 0.4) + 0.2; // Default 0.4m + 0.2m untuk prediksi

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

        // Data dengan prediksi konstan (muka air rata)
        const data = leveeData.map((point) => {
            return {
                x: point.x,
                levee: point.levee,
                predicted: predictedWaterLevel, // Nilai konstan untuk muka air rata
            };
        });

        console.log("TanggulPrediksi chartData (muka air rata):", data); // Debug log
        return data;
    }, [stationData.value]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const predictedLevel = (stationData.value || 0.4) + 0.2;
            const leveePayload = payload.find((p) => p.name === "Bingkai Tanggul");
            const leveeValue = leveePayload ? leveePayload.value : null;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-700">
                        Prediksi Level Air: {predictedLevel.toFixed(2)}m
                    </p>
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
                <h3 className="text-lg font-semibold text-gray-900">Prediksi</h3>
                <p className="text-sm text-gray-500 mt-1">Parameter dan threshold untuk prediksi banjir</p>
            </div>
            <div className="px-6 pb-6">
                <div style={{ width: "100%", height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 80, left: 60, bottom: 20 }}>
                            <defs>
                                <linearGradient id="leveeGradientPred" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#E5E7EB" />
                                    <stop offset="50%" stopColor="#D1D5DB" />
                                    <stop offset="100%" stopColor="#9CA3AF" />
                                </linearGradient>
                                <linearGradient id="waterPredGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="50%" stopColor="#ef4444" stopOpacity={0.6} />
                                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.4} />
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

                            {/* Area visual air prediksi berwarna merah - muka air rata tanpa outline */}
                            <Area
                                type="monotone"
                                dataKey="predicted"
                                fill="url(#waterPredGradient)"
                                fillOpacity={1}
                                stroke="none" // Menghilangkan outline
                                strokeWidth={0} // Menghilangkan ketebalan outline
                                name="Prediksi"
                            />

                            {/* Garis horizontal untuk menunjukkan level air prediksi */}
                            <Line
                                type="monotone"
                                dataKey="predicted"
                                stroke="#b91c1c"
                                strokeWidth={0}
                                dot={false}
                                activeDot={false}
                                legendType="none"
                            />

                            {/* Area tanggul (abu-abu) dengan sisi miring landai */}
                            <Area
                                type="monotone"
                                dataKey="levee"
                                fill="url(#leveeGradientPred)"
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

export default PredictionChart;
