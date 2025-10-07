import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { fetchDevices } from "@/services/devices";

// Lazy load Chart component untuk optimasi bundle
const Chart = lazy(() => import("@/components/common/Chart"));

const FloodRunningBar = ({ onDataUpdate, onStationSelect, onMapFocus, isSidebarOpen = false }) => {
    const [tickerData, setTickerData] = useState([]);

    const generateDetailedHistory = (currentValue) => {
        const history = [];
        let baseValue = currentValue - (Math.random() * 0.5 + 0.2);

        for (let i = 0; i < 20; i++) {
            const change = (Math.random() - 0.5) * 0.15;
            baseValue = Math.max(0.5, Math.min(5, baseValue + change));
            history.push(parseFloat(baseValue.toFixed(2)));
        }
        return history;
    };

    useEffect(() => {
        const initializeStationData = (devices) => {
            const initialStations = devices.map((device) => {
                const initialValue = parseFloat((Math.random() * 4.5 + 0.5).toFixed(2));
                return {
                    id: device.id,
                    name: device.name,
                    value: initialValue,
                    unit: "m",
                    location: device.river_basin ? device.river_basin.name : "Unknown",
                    coordinates: [parseFloat(device.longitude), parseFloat(device.latitude)],
                    status: "safe", // Default status
                    history: generateDetailedHistory(initialValue),
                };
            });
            setTickerData(initialStations);
        };

        const loadInitialData = async () => {
            try {
                const devicesData = await fetchDevices();
                if (devicesData && devicesData.length > 0) {
                    initializeStationData(devicesData);
                }
            } catch (error) {
                console.error("Failed to fetch devices for running bar:", error);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (tickerData.length === 0) return;

        const updateTickerData = () => {
            setTickerData((prev) =>
                prev.map((item) => {
                    let newValue = Math.max(0.5, Math.min(5, item.value + (Math.random() - 0.5) * 0.2));
                    const newStatus = "safe"; // Default status
                    const newHistory = [...item.history.slice(1), newValue];
                    return {
                        ...item,
                        value: newValue,
                        status: newStatus,
                        history: newHistory,
                    };
                })
            );
        };

        const interval = setInterval(updateTickerData, 3000);
        return () => clearInterval(interval);
    }, [tickerData]);

    useEffect(() => {
        if (onDataUpdate && tickerData && tickerData.length > 0) {
            onDataUpdate(tickerData);
        }
    }, [tickerData, onDataUpdate]);

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

    const getStatusBgColor = (status) => {
        switch (status) {
            case "safe":
                return "bg-green-500";
            case "warning":
                return "bg-yellow-500";
            case "alert":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const formatValue = (value) => {
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(value);
    };

    // Hitung durasi animasi berdasarkan jumlah data
    if (tickerData.length === 0) {
        return null; // or a loading state
    }
    const animationDuration = tickerData.length * 4; // 4 detik per item

    return (
        <div
            className={`fixed top-4 z-[70] transition-all duration-300 ease-in-out left-[calc(368px+2rem)] flood-running-bar`}
        >
            <div className="w-full">
                <div className="overflow-hidden bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1.5 sm:p-2">
                    <div
                        className="flex space-x-2 sm:space-x-2 whitespace-nowrap"
                        style={{
                            animation: `infiniteScroll ${animationDuration}s linear infinite`,
                            width: "fit-content",
                        }}
                    >
                        {/* Konten pertama */}
                        {tickerData.map((item) => (
                            <div
                                key={`first-${item.id}`}
                                className="flex items-center space-x-1.5 sm:space-x-2 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 min-w-max border border-gray-200"
                            >
                                <div
                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusBgColor(
                                        item.status
                                    )}`}
                                ></div>
                                <span className="text-xs text-gray-700 font-medium truncate max-w-12 sm:max-w-16">
                                    {item.name.replace("Stasiun ", "")}
                                </span>
                                <div className="flex items-center space-x-0.5 sm:space-x-1">
                                    <span className="text-xs font-bold text-gray-900">{formatValue(item.value)}</span>
                                    <span className="text-xs text-gray-500">{item.unit}</span>
                                </div>
                                <Suspense fallback={<div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>}>
                                    <Chart
                                        data={item.history}
                                        width={48}
                                        height={22}
                                        showTooltip={false}
                                        miniMode={true}
                                        status={item.status}
                                        canvasId={`chart-first-${item.id}`}
                                        className="w-12 h-6 rounded"
                                    />
                                </Suspense>
                            </div>
                        ))}

                        {/* Konten duplikat untuk seamless scrolling */}
                        {tickerData.map((item) => (
                            <div
                                key={`second-${item.id}`}
                                className="flex items-center space-x-1.5 sm:space-x-2 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 min-w-max border border-gray-200"
                            >
                                <div
                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusBgColor(
                                        item.status
                                    )}`}
                                ></div>
                                <span className="text-xs text-gray-700 font-medium truncate max-w-12 sm:max-w-16">
                                    {item.name.replace("Stasiun ", "")}
                                </span>
                                <div className="flex items-center space-x-0.5 sm:space-x-1">
                                    <span className="text-xs font-bold text-gray-900">{formatValue(item.value)}</span>
                                    <span className="text-xs text-gray-500">{item.unit}</span>
                                </div>
                                <Suspense fallback={<div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>}>
                                    {/* <Chart
                                        data={item.history}
                                        width={48}
                                        height={22}
                                        showTooltip={false}
                                        miniMode={true}
                                        status={item.status}
                                        canvasId={`chart-second-${item.id}`}
                                        className="w-12 h-6 rounded"
                                    /> */}
                                </Suspense>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes infiniteScroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                /* Responsive right positioning based on FilterButton size */
                .flood-running-bar {
                    right: calc(1.5rem + 40px + 2rem); /* Mobile: 1.5rem margin + 40px button + 2rem margin */
                }
                
                @media (min-width: 640px) {
                    .flood-running-bar {
                        right: calc(1.5rem + 40px + 2rem); /* Desktop: 1.5rem margin + 40px button + 2rem margin */
                    }
                }
            `}</style>
        </div>
    );
};

export default FloodRunningBar;
