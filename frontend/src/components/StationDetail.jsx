// src/components/StationDetail.jsx

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getStatusColor, getStatusBgColor, getStatusText } from "@/utils/statusUtils";
import { fetchDataActualsBySensor } from "../services/dataActuals";
import { fetchDevice } from "../services/devices";
import { useStation, useDevices, useUI } from "@/hooks/useAppContext";

const StationDetail = () => {
    // Get data from Context
    const { selectedStation, handleCloseStationDetail } = useStation();
    const { tickerData } = useDevices();
    const { isDetailPanelOpen, handleToggleDetailPanel, handleCloseDetailPanel } = useUI();
    
    const showArrow = true;
    const [stationData, setStationData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [dataSource, setDataSource] = useState(null); // 'data-actuals' | 'fallback' | 'ticker'

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mengatur animasi visibility saat panel dibuka/ditutup dengan efek fade
    useEffect(() => {
        if (selectedStation) {
            // Fade in - delay kecil untuk memicu animasi
            setTimeout(() => {
                setIsVisible(true);
            }, 10);
        } else {
            // Fade out - langsung set invisible
            setIsVisible(false);
        }
    }, [selectedStation]);

    // Reusable fetch function that enriches station data from per-sensor DataActuals.
    const fetchStationSensors = async (foundStation, { showWarnings = false, signal } = {}) => {
        if (!foundStation) return null;
        setIsRefreshing(true);
        setDataSource(null);

        try {
            let sensors = (foundStation.sensors || []).slice();

            // Jika tidak ada sensors pada tickerData, coba fetch detail device (backend devices/:id)
            if (!sensors || sensors.length === 0) {
                try {
                    const deviceDetail = await fetchDevice(foundStation.id);
                    sensors = deviceDetail?.sensors || [];
                } catch (deviceErr) {
                    console.warn('fetchDevice failed for', foundStation.id, deviceErr?.message || deviceErr);
                    sensors = [];
                }
            }

            // Jika tetap tidak ada sensors, buat synthetic sensor berdasarkan device (fallback)
            if (!sensors || sensors.length === 0) {
                sensors = [
                    {
                        name: foundStation.name,
                        parameter: 'water_level',
                        type: 'water_level',
                        code: undefined,
                        value: foundStation.value,
                        unit: foundStation.unit || 'm',
                        lastUpdate: null,
                    },
                ];
            }

            const promises = sensors.map(async (sensor) => {
                const sensorCode = sensor.code || sensor.sensor_code || sensor.id;

                // If no sensor code (synthetic/fallback), just return sensor with device name
                if (!sensorCode) return { ...sensor, name: foundStation.name };

                try {
                    const resp = await fetchDataActualsBySensor(sensorCode, { per_page: 1, sort_by: 'created_at', sort_order: 'desc' });
                    if (signal?.aborted) throw new Error('aborted');
                    const list = resp?.data || resp || [];
                    const latest = Array.isArray(list) ? list[0] : list;
                    if (latest) {
                        return {
                            ...sensor,
                            name: foundStation.name,
                            value: latest.value ?? latest.nilai ?? sensor.value,
                            unit: latest.unit ?? sensor.unit,
                            lastUpdate: latest.created_at ?? latest.updated_at ?? sensor.lastUpdate,
                            status: latest.status ?? sensor.status,
                        };
                    }
                } catch (err) {
                    console.warn('Per-sensor fetch failed for', sensorCode, err?.message || err);
                }

                return { ...sensor, name: foundStation.name };
            });

            let sensorsUpdated = await Promise.all(promises);

            // If station is an ARR station, map water sensors to rainfall
            const stationNameUpper = (foundStation.name || '').trim().toUpperCase();
            const isARRStation = stationNameUpper.startsWith('ARR') || stationNameUpper.includes(' ARR');

            if (isARRStation) {
                sensorsUpdated = sensorsUpdated.map((s) => {
                    const nameLower = (s.name || '').toLowerCase();
                    const typeLower = (s.type || '').toLowerCase();
                    const isWaterSensor = s.parameter === 'water_level' || nameLower.includes('water') || typeLower.includes('water') || nameLower.includes('air');
                    if (isWaterSensor) {
                        // ARR: treat as rainfall (mm) and set elevation values to 0 as backend stores 0
                        return { ...s, parameter: 'rainfall', type: 'rainfall', unit: 'mm', value: 0 };
                    }
                    // For other sensors, ensure unit is set to mm for ARR (optional; keep existing if present)
                    return { ...s, unit: s.unit || 'mm' };
                });
            }

            // Determine if at least one sensor had a fresh value (heuristic)
            const hadFresh = sensorsUpdated.some((s, i) => {
                const orig = (foundStation.sensors || [])[i] || {};
                return s.value !== undefined && s.value !== orig.value;
            });

            const waterSensor = sensorsUpdated.find((s) => (
                s.parameter === 'water_level' || s.parameter === 'rainfall' ||
                (s.name && (s.name.toLowerCase().includes('water') || s.name.toLowerCase().includes('rain') || s.name.toLowerCase().includes('hujan'))) ||
                (s.type && (s.type.toLowerCase().includes('water') || s.type.toLowerCase().includes('rain') || s.type.toLowerCase().includes('hujan')))
            )) || sensorsUpdated[0];

            // For ARR stations the elevation/value should be zero and unit mm
            const valueNum = isARRStation ? 0 : (waterSensor ? parseFloat(waterSensor.value) : parseFloat(foundStation.value));

            const newStation = {
                ...foundStation,
                sensors: sensorsUpdated,
                value: Number.isFinite(valueNum) ? valueNum : (foundStation.value ?? null),
                unit: isARRStation ? 'mm' : (waterSensor?.unit || foundStation.unit),
            };

            setStationData(newStation);
            setDataSource(hadFresh ? 'data-actuals' : 'ticker');
            return newStation;
        } catch (e) {
            console.error('fetchStationSensors failed:', e);
            if (showWarnings) setDataSource('fallback');
            const sensorsRenamed = (foundStation.sensors || []).map((s) => ({ ...s, name: foundStation.name }));
            const fallbackStation = { ...foundStation, sensors: sensorsRenamed };
            setStationData(fallbackStation);
            return fallbackStation;
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (selectedStation && tickerData) {
            const foundStation = tickerData.find((station) => station.id === selectedStation.id);
            if (!foundStation) return;

            const controller = new AbortController();
            fetchStationSensors(foundStation, { signal: controller.signal }).catch((e) => console.warn(e));

            return () => controller.abort();
        }
    }, [selectedStation, tickerData]);

    // Handle swipe down to close on mobile with improved flexibility
    const handleTouchStart = (e) => {
        if (!isMobile) return;
        
        e.preventDefault();
        setIsDragging(true);
        setDragOffset(0);
        
        const touch = e.touches ? e.touches[0] : e;
        const startY = touch.clientY;
        const startTime = Date.now();
        
        const handleTouchMove = (e) => {
            e.preventDefault();
            const currentTouch = e.touches ? e.touches[0] : e;
            const currentY = currentTouch.clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) {
                setDragOffset(deltaY);
            }
        };
        
        const handleTouchEnd = (e) => {
            const currentTouch = e.changedTouches ? e.changedTouches[0] : e;
            const currentY = currentTouch.clientY;
            const deltaY = currentY - startY;
            const deltaTime = Date.now() - startTime;
            const velocity = deltaY / deltaTime;
            
            const shouldClose = 
                deltaY > 120 || 
                (velocity > 0.5 && deltaY > 60) || 
                (velocity > 1 && deltaY > 30);
            
            if (shouldClose) {
                handleClose();
            }
            
            setIsDragging(false);
            setDragOffset(0);
            cleanup();
        };
        
        const cleanup = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('mousemove', handleTouchMove);
            document.removeEventListener('mouseup', handleTouchEnd);
        };
        
        if (e.type === 'touchstart') {
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        } else {
            document.addEventListener('mousemove', handleTouchMove);
            document.addEventListener('mouseup', handleTouchEnd);
        }
    };

    // Handler untuk close dengan animasi
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Sama dengan durasi animasi
    };

    // Handler untuk trigger close dari backdrop - untuk memberikan animasi
    const handleTriggerClose = () => {
        handleClose();
    };

    // Expose method untuk parent component
    useEffect(() => {
        // Set up event listener untuk trigger close dari backdrop
        const triggerClose = (event) => {
            if (event.detail?.type === 'station-detail') {
                handleTriggerClose();
            }
        };
        window.addEventListener('triggerCloseStationDetail', triggerClose);
        return () => window.removeEventListener('triggerCloseStationDetail', triggerClose);
    }, []);

    // Prevent body scroll when mobile panel is open
    useEffect(() => {
        if (isMobile && selectedStation) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.touchAction = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.touchAction = 'auto';
        };
    }, [isMobile, selectedStation]);

    if (!selectedStation || !stationData) {
        return null;
    }

    return (
        <>
            {/* Panel */}
            <div
                className={`fixed bg-white shadow-2xl z-[50] transform flex flex-col transition-all duration-300 ease-in-out ${
                    isMobile 
                    // h-[60vh] ukuran tinggi modal
                        ? `bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                          }`
                        : `top-20 left-0 h-[calc(100vh-5rem)] w-96 ${
                            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                          }`
                }`}
                style={{ 
                    willChange: "transform, opacity",
                    transform: isMobile 
                        ? isDragging 
                            ? `translateY(${dragOffset}px)` 
                            : isVisible 
                                ? "translateY(0)" 
                                : "translateY(100%)"
                        : undefined,
                }}
            >
                {/* Header */}
                <div 
                    className={`bg-white p-4 flex-shrink-0 transition-colors ${
                        isMobile ? 'rounded-t-2xl cursor-grab active:cursor-grabbing' : ''
                    } ${
                        isMobile && isDragging ? 'bg-gray-100' : ''
                    }`}
                    onTouchStart={isMobile ? handleTouchStart : undefined}
                    onMouseDown={isMobile ? handleTouchStart : undefined}
                >
                    {/* Mobile drag handle */}
                    {isMobile && (
                        <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1.5 rounded-full transition-all duration-200 ${
                            isDragging 
                                ? 'bg-gray-600 w-12' 
                                : 'bg-gray-400 hover:bg-gray-500'
                        }`}></div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                        {/* Desktop close button */}
                        {!isMobile && (
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start mt-1"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div className="flex-1">

                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FontAwesomeIcon icon={faLocationDot} className="text-blue-600 text-sm" />
                                {stationData.name}
                            </h3>
                            {/* Arrow button untuk membuka detail panel */}
                            {showArrow && !isDetailPanelOpen && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleToggleDetailPanel}
                                        className="group w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 ease-in-out"
                                        title="Buka Detail Panel"
                                    >
                                        {/* Konten teks di sebelah kiri */}
                                        <div className="text-left">
                                            <span className="font-semibold text-slate-800 group-hover:text-blue-800 transition-colors">
                                                Detail Informasi
                                            </span>
                                            <p className="text-sm text-slate-500 group-hover:text-blue-600 transition-colors">
                                                Lihat data lengkap stasiun
                                            </p>
                                        </div>

                                        {/* Ikon panah di sebelah kanan */}
                                        <div className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Content */}
                <div className={`flex-1 overflow-y-auto overflow-x-hidden ${
                    isMobile ? 'pb-6' : ''
                }`}>
            <div className="p-4 space-y-6 pb-6">
                {/* Status Card */}
                <div className={`p-3 rounded-lg border-2 ${getStatusBgColor(stationData.status)}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Status Saat Ini</p>
                            <p className={`text-xl font-bold ${getStatusColor(stationData.status)}`}>
                                {getStatusText(stationData.status)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-gray-600">{typeof stationData.value === 'number' ? stationData.value.toFixed(1) : (stationData.value ?? '-')} {stationData.unit}</p>
                            {/* Source indicator */}
                            <p className="text-xs text-gray-500 mt-1">
                            </p>
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
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {stationData.sensors ? stationData.sensors.length : 0} Sensor
                            </span>

                            <button
                                onClick={async () => {
                                    const foundStation = tickerData.find((s) => s.id === selectedStation.id);
                                    if (!foundStation) return;
                                    await fetchStationSensors(foundStation, { showWarnings: true });
                                }}
                                
                            >
                                {isRefreshing ? (
                                    <svg className="animate-spin h-4 w-4 text-gray-600" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6" />
                                    </svg>
                                )}
                            </button>
                        </div>
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
                </div>
            </div>
        </>
    );
};

export default StationDetail;