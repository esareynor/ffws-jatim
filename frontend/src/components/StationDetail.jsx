// src/components/StationDetail.jsx

import React, { useState, useEffect } from "react";
import SidebarTemplate from "@components/layout/SidebarTemplate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
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
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

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

    useEffect(() => {
        if (selectedStation && tickerData) {
            const foundStation = tickerData.find((station) => station.id === selectedStation.id);
            if (foundStation) {
                setStationData(foundStation);
            }
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
                                        onClick={onArrowToggle}
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
                            <p className="text-3xl font-bold text-gray-600">{stationData.value.toFixed(1)} {stationData.unit}</p>
                            {/* <p className="text-sm text-gray-500">{stationData.unit}</p> */}
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
                </div>
            </div>
        </>
    );
};

export default StationDetail;