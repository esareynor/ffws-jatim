import React, { useState, useEffect } from "react";
import SidebarTemplate from "@components/layout/SidebarTemplate";
import { getStatusColor, getStatusBgColor, getStatusText } from "@/utils/statusUtils";

const StationDetail = ({
    selectedStation,
    onClose,
    tickerData,
    showArrow = false,
    onArrowToggle,
    isDetailPanelOpen = false,
    onCloseDetailPanel,
}) => {
    const [stationData, setStationData] = useState(null);

    useEffect(() => {
        if (selectedStation && tickerData) {
            const foundStation = tickerData.find((station) => station.id === selectedStation.id);
            if (foundStation) {
                setStationData(foundStation);
            }
        }
    }, [selectedStation, tickerData]);

    if (!selectedStation || !stationData) {
        return null;
    }

    return (
        <SidebarTemplate
            isOpen={!!selectedStation}
            onClose={onClose}
            title={stationData.name}
            showArrow={showArrow}
            onArrowToggle={onArrowToggle}
            isDetailPanelOpen={isDetailPanelOpen}
            onCloseDetailPanel={onCloseDetailPanel}
        >
            <div className="p-4 space-y-6 pb-6">
                {/* Status Card */}
                <div className={`p-4 rounded-lg border-2 ${getStatusBgColor(stationData.status)}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Status Saat Ini</p>
                            <p className={`text-xl font-bold ${getStatusColor(stationData.status)}`}>
                                {getStatusText(stationData.status)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900">{stationData.value.toFixed(1)}</p>
                            <p className="text-sm text-gray-500">{stationData.unit}</p>
                        </div>
                    </div>
                </div>

                {/* Address Card */}
                <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Alamat
                    </h3>
                    <p className="text-gray-600">{stationData.address || "Alamat tidak tersedia"}</p>
                </div>

                {/* Sensor Information */}
                <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                            Informasi Sensor
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {stationData.sensors ? stationData.sensors.length : 0} Sensor
                        </span>
                    </div>
                    
                    {stationData.sensors && stationData.sensors.length > 0 ? (
                        <div className="space-y-3">
                            {stationData.sensors.map((sensor, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{sensor.name}</p>
                                            <p className="text-sm text-gray-500">{sensor.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{sensor.value} {sensor.unit}</p>
                                        <p className="text-sm text-gray-500">Update: {sensor.lastUpdate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p className="mt-2 text-gray-500">Tidak ada data sensor</p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarTemplate>
    );
};

export default StationDetail;