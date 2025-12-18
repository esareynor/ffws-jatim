import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { getStatusText } from "@/utils/statusUtils";
import {
    MapPin,
    AlertTriangle,
    CloudRain,
    ThermometerSun,
    Activity,
    Building2,
    ArrowLeft,
} from "lucide-react";
import { fetchDataActualsBySensor } from "../../services/dataActuals";

// Lazy load komponen chart yang berat untuk optimasi bundle
const MonitoringChart = lazy(() => import("@/components/common/MonitoringDualLinet"));
const TanggulAktual = lazy(() => import("@/components/common/TanggulAktual"));
const PredictionChart = lazy(() => import("@/components/common/TanggulPrediksi"));

// Daftar tab konstan agar tidak dibuat ulang setiap render
const DETAIL_TABS = [
    { key: "sensor", label: "Sensor" },
    { key: "cuaca", label: "Cuaca" },
    { key: "monitoring", label: "Monitoring" },
    { key: "riwayat", label: "Riwayat" },
];

/**
 * Komponen panel detail dengan layout two column
 * Menampilkan informasi lengkap tentang stasiun monitoring banjir
 */
const DetailPanel = ({ isOpen, onClose, stationData, chartHistory, isAutoSwitchOn = false }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("sensor"); // 'sensor' | 'cuaca' | 'monitoring' | 'riwayat'
    const [isTabChanging, setIsTabChanging] = useState(false);
    const [previousTab, setPreviousTab] = useState(null);
    const [isDotAnimating, setIsDotAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [weatherData, setWeatherData] = useState(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mengatur animasi visibility saat panel dibuka/ditutup
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setIsVisible(true);
            }, 10);

            // Delay untuk navbar - muncul setelah panel terbuka
            setTimeout(() => {
                setIsNavbarVisible(true);
            }, 200); // 200ms delay untuk navbar
        } else {
            // Animasi close - geser ke kiri dengan fade out
            setIsVisible(false);
            setIsNavbarVisible(false);
        }
    }, [isOpen]);

    // CSS untuk animasi - menggunakan CSS modules atau styled-components lebih baik
    useEffect(() => {
        const styleId = "detail-panel-animations";

        // Cek apakah style sudah ada
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
      @keyframes underlineSlideIn {
        0% {
          transform: translateX(-50%) scaleX(0);
          opacity: 0;
        }
        30% {
          opacity: 0.8;
        }
        100% {
          transform: translateX(-50%) scaleX(1);
          opacity: 1;
        }
      }
      
      @keyframes dotPopIn {
        0% {
          transform: translateX(-50%) scale(0);
          opacity: 0;
        }
        100% {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes dotSlideOut {
        0% {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateX(-50%) scale(0.8);
          opacity: 0.8;
        }
        100% {
          transform: translateX(-50%) scale(0);
          opacity: 0;
        }
      }
      
      @keyframes underlineClose {
        0% {
          transform: translateX(-50%) scaleX(1);
          opacity: 1;
        }
        50% {
          transform: translateX(-50%) scaleX(0.3);
          opacity: 0.6;
        }
        100% {
          transform: translateX(-50%) scaleX(0);
          opacity: 0;
        }
      }
      
      .underline-active {
        animation: underlineSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .dot-hover {
        animation: dotPopIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .dot-slide-out {
        animation: dotSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .underline-close {
        animation: underlineClose 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
    `;
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    // Auto close detail panel saat auto switch berjalan
    useEffect(() => {
        if (isAutoSwitchOn && isOpen) {
            // Tutup detail panel dengan animasi saat auto switch aktif
            handleClose();
        }
    }, [isAutoSwitchOn]);

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

    // Handler untuk close dengan animasi - menggunakan useCallback untuk optimasi
    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Sama dengan durasi animasi
    }, [onClose]);

    // Handler untuk trigger close dari backdrop - untuk memberikan animasi
    const handleTriggerClose = useCallback(() => {
        handleClose();
    }, [handleClose]);

    // Expose method untuk parent component
    useEffect(() => {
        // Set up event listener untuk trigger close dari backdrop
        const triggerClose = (event) => {
            if (event.detail?.type === 'detail-panel') {
                handleTriggerClose();
            }
        };
        window.addEventListener('triggerCloseDetailPanel', triggerClose);
        return () => window.removeEventListener('triggerCloseDetailPanel', triggerClose);
    }, [handleTriggerClose]);

    // Prevent body scroll when mobile panel is open
    useEffect(() => {
        if (isMobile && isOpen) {
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
    }, [isMobile, isOpen]);

    // Determine station type to customize visible tabs
    const stationNameUpper = (stationData?.name || "").trim().toUpperCase();
    const isARRStation = stationNameUpper.startsWith("ARR") || stationNameUpper.includes(" ARR");
    const isAWLRStation = stationNameUpper.includes("AWLR");

    // Compute visible tabs based on station type
    const visibleTabs = React.useMemo(() => {
        if (isARRStation) return ["cuaca", "monitoring", "riwayat"];
        if (isAWLRStation) return ["sensor", "monitoring", "riwayat"];
        return DETAIL_TABS.map((t) => t.key);
    }, [isARRStation, isAWLRStation]);

    // Fetch weather data for ARR stations
    useEffect(() => {
        const fetchWeatherData = async () => {
            if (!isARRStation || !stationData || activeTab !== "cuaca") return;

            setIsLoadingWeather(true);
            try {
                // Ambil sensor rainfall dari stationData
                const rainfallSensor = stationData.sensors?.find((s) => 
                    s.parameter === 'rainfall' || 
                    s.type === 'rainfall' ||
                    (s.name && s.name.toLowerCase().includes('rain')) ||
                    (s.name && s.name.toLowerCase().includes('hujan'))
                ) || stationData.sensors?.[0];

                if (rainfallSensor?.code) {
                    const resp = await fetchDataActualsBySensor(rainfallSensor.code, { 
                        per_page: 1, 
                        sort_by: 'received_at', 
                        sort_order: 'desc' 
                    });
                    const list = resp?.data || resp || [];
                    const latest = Array.isArray(list) ? list[0] : list;
                    
                    if (latest) {
                        setWeatherData({
                            rainfall: latest.value || 0,
                            status: latest.threshold_status || latest.status || 'safe',
                            receivedAt: latest.received_at || latest.created_at,
                            unit: latest.unit || 'mm',
                        });
                    }
                } else if (stationData.sensors && stationData.sensors.length > 0) {
                    // Fallback: gunakan data dari stationData.sensors
                    const sensor = stationData.sensors[0];
                    setWeatherData({
                        rainfall: sensor.value || 0,
                        status: sensor.status || sensor.threshold_status || 'safe',
                        receivedAt: sensor.lastUpdate,
                        unit: sensor.unit || 'mm',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch weather data:', error);
                // Fallback to stationData
                if (stationData.value !== undefined) {
                    setWeatherData({
                        rainfall: stationData.value || 0,
                        status: stationData.status || stationData.threshold_status || 'safe',
                        receivedAt: new Date().toISOString(),
                        unit: stationData.unit || 'mm',
                    });
                }
            } finally {
                setIsLoadingWeather(false);
            }
        };

        if (isOpen && isARRStation && activeTab === "cuaca") {
            fetchWeatherData();
        }
    }, [isOpen, isARRStation, activeTab, stationData]);

    // Ensure activeTab is valid for visibleTabs when stationData changes
    useEffect(() => {
        if (!visibleTabs.includes(activeTab)) {
            // choose default tab
            const defaultTab = isARRStation ? "cuaca" : isAWLRStation ? "sensor" : "sensor";
            setActiveTab(defaultTab);
        }
    }, [stationData, visibleTabs]);

    // Handler untuk tab click dengan animasi clean - menggunakan useCallback untuk optimasi
    const handleTabClick = useCallback(
        (tabKey) => {
            if (isTabChanging || activeTab === tabKey) return; // Prevent multiple clicks during transition

            setIsTabChanging(true);
            setIsDotAnimating(true);
            setPreviousTab(activeTab);

            // Animasi underline menutup dan muncul underline baru
            setTimeout(() => {
                setActiveTab(tabKey);

                // Reset animasi state setelah transisi selesai
                setTimeout(() => {
                    setIsTabChanging(false);
                    setIsDotAnimating(false);
                    setPreviousTab(null);
                }, 400); // 400ms untuk animasi underline baru
            }, 400); // 400ms delay untuk animasi underline menutup
        },
        [isTabChanging, activeTab]
    );

    // Tidak render jika panel tidak dibuka atau data tidak ada
    if (!isOpen) return null;

    // Fallback jika stationData tidak ada
    if (!stationData) {
        return (
            <>
                {/* Panel */}
                <div
                    className={`fixed bg-white shadow-2xl z-[50] transform flex flex-col ${
                        isMobile 
                        // h-[60vh] ukuran tinggi modal
                            ? `bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl ${ 
                                isVisible ? "opacity-100" : "opacity-0"
                              }`
                            : `rounded-tr-lg top-20 left-20 right-0 bottom-0 transition-all duration-300 ease-in-out ${
                                isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
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
                        transition: isMobile && !isDragging 
                            ? "transform 300ms ease-in-out, opacity 300ms ease-in-out" 
                            : undefined
                    }}
                >
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-gray-500 text-lg">Tidak ada data stasiun</div>
                            <div className="text-gray-400 text-sm mt-2">Pilih stasiun untuk melihat detail</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Panel */}
            <div
                className={`fixed bg-white shadow-2xl z-[50] transform flex flex-col ${
                    isMobile 
                        ? `bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl ${
                            isVisible ? "opacity-100" : "opacity-0"
                          }`
                        : `rounded-tr-lg top-20 left-96 right-0 bottom-0 transition-all duration-300 ease-in-out ${
                            isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
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
                    transition: isMobile && !isDragging 
                        ? "transform 300ms ease-in-out, opacity 300ms ease-in-out" 
                        : undefined
                }}
            >
                <div className="h-full flex flex-col">
                {/* Header Panel - Gradient Styling */}
                <div 
                    className={`bg-gradient-to-r from-white-50 via-white-100 to-white-200 p-4 flex-shrink-0 shadow-lg transition-colors ${
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
                    
                    {/* Baris judul + tombol close dengan alignment yang rapi */}
                    <div className="flex items-center justify-between">
                        {/* Bagian kiri - tombol back + judul */}
                        <div className="flex items-center gap-3">
                            {/* Desktop close button */}
                            {!isMobile && (
                                <button
                                    onClick={handleClose}
                                    className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl border border-blue-100 hover:border-blue-200"
                                    aria-label="Kembali"
                                >
                                    <ArrowLeft className="w-6 h-6 text-blue-600 group-hover:text-blue-800 transition-colors duration-300" />
                                </button>
                            )}
                            <div className="min-w-0">
                                <h3
                                    className="text-xl font-bold text-gray-900 tracking-tight"
                                    style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
                                >
                                    Detail Informasi
                                </h3>
                                <p
                                    className="text-base text-gray-700 mt-1 font-semibold flex items-center gap-2"
                                    style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
                                >
                                    <MapPin className="text-blue-600 w-4 h-4" />
                                    {stationData.name}
                                </p>
                            </div>
                        </div>

                        {/* Bagian kanan - status info */}
                        <div className="text-right">
                            <div className="flex items-center justify-end gap-3 mb-2">
                                {isAutoSwitchOn && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-xl text-sm font-semibold border border-blue-300 shadow-lg">
                                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
                                        Auto Switch
                                    </div>
                                )}
                                <div
                                    className={`text-sm font-bold px-6 py-1 rounded-xl border-2 shadow-lg ${
                                        stationData.status === "safe"
                                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
                                            : stationData.status === "warning"
                                            ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
                                            : stationData.status === "alert"
                                            ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
                                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300"
                                    }`}
                                >
                                    {getStatusText(stationData.status)}
                                </div>
                            </div>
                            <div
                                className="text-sm text-gray-600 font-semibold"
                                style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
                            >
                                Update {new Date().toLocaleTimeString("id-ID")}
                            </div>
                        </div>
                    </div>
                    {/* Navigation tabs dengan modern styling */}
                    <div
                        className={`mt-6 pb-3 transition-all duration-500 ease-out ${
                            isNavbarVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                    >
                        <nav className="relative">
                            <div className="flex items-center justify-center space-x-8 text-base">
                                {DETAIL_TABS.filter((t) => visibleTabs.includes(t.key)).map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => handleTabClick(tab.key)}
                                        disabled={isTabChanging}
                                        className={`relative py-4 px-4 transition-all duration-500 ease-out rounded-lg group ${
                                            activeTab === tab.key
                                                ? "text-gray-800 font-semibold"
                                                : "text-gray-600 font-medium hover:text-gray-800"
                                        } ${isTabChanging ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
                                        role="tab"
                                        aria-selected={activeTab === tab.key}
                                        style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
                                    >
                                        <span className="relative z-10 whitespace-nowrap text-base font-semibold leading-tight">
                                            {tab.label}
                                        </span>
                                        {/* Active indicator - sejajar dengan kotak navbar */}
                                        {activeTab === tab.key ? (
                                            <div className="absolute bottom-0 left-1/2 w-8 h-1 bg-gradient-to-r from-blue-300 to-blue-800 rounded-full shadow-sm underline-active" />
                                        ) : (
                                            <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:dot-hover transition-all duration-300 ease-out" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Konten Panel - Layout yang lebih rapi */}
                <div className={`flex-1 overflow-y-auto p-6 ${
                    isMobile ? 'pb-6' : ''
                }`}>
                    <div
                        className={`space-y-6 transition-all duration-500 ease-out ${
                            isTabChanging ? "opacity-50 scale-95" : "opacity-100 scale-100"
                        }`}
                    >
                        {/* Chart utama - hanya untuk tab selain sensor */}
                        {activeTab !== "sensor" && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3
                                            className="text-2xl font-bold text-gray-900 tracking-tight"
                                            style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
                                        >
                                            {activeTab === "riwayat" && "Riwayat Data"}
                                            {activeTab === "cuaca" && "Cuaca"}
                                            {activeTab === "monitoring" && "Aktual & Prediksi"}
                                        </h3>
                                    </div>
                                    <p
                                        className="text-base text-gray-600 font-semibold"
                                        style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
                                    >
                                        {stationData.location}
                                    </p>
                                </div>
                                <div className="px-8 pb-8">
                                    {activeTab === "riwayat" && (
                                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                            Riwayat data akan tersedia di sini.
                                        </div>
                                    )}
                                    {activeTab === "cuaca" && (
                                        <div className="space-y-4">
                                            {isLoadingWeather ? (
                                                <div className="text-center py-8">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                    <p className="mt-2 text-gray-600">Memuat data cuaca...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Cuaca Saat Ini */}
                                                    <div className="mb-3">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                                            Cuaca Saat Ini
                                                        </h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm">
                                                                <div className="flex justify-center mb-2">
                                                                    <CloudRain className="w-8 h-8 text-blue-500" />
                                                                </div>
                                                                <div className="text-sm text-gray-600 mb-1">Curah Hujan</div>
                                                                <div className="text-xl font-bold text-blue-600">
                                                                    {weatherData?.rainfall !== undefined 
                                                                        ? `${parseFloat(weatherData.rainfall).toFixed(1)} ${weatherData.unit || 'mm'}`
                                                                        : stationData?.value !== undefined
                                                                        ? `${parseFloat(stationData.value).toFixed(1)} ${stationData.unit || 'mm'}`
                                                                        : '-'
                                                                    }
                                                                </div>
                                                                {weatherData?.receivedAt && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        {new Date(weatherData.receivedAt).toLocaleString('id-ID')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm">
                                                                <div className="flex justify-center mb-2">
                                                                    <ThermometerSun className="w-8 h-8 text-orange-500" />
                                                                </div>
                                                                <div className="text-sm text-gray-600 mb-1">Status</div>
                                                                <div className={`text-lg font-semibold ${
                                                                    weatherData?.status === 'safe' || weatherData?.status === 'normal' ? 'text-green-600' :
                                                                    weatherData?.status === 'warning' ? 'text-yellow-600' :
                                                                    weatherData?.status === 'danger' || weatherData?.status === 'alert' ? 'text-red-600' :
                                                                    'text-gray-600'
                                                                }`}>
                                                                    {getStatusText(weatherData?.status || stationData?.status || 'safe')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Indikator Risiko Banjir */}
                                            {!isLoadingWeather && (
                                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                                        Indikator Risiko
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className={`text-center p-3 rounded-lg shadow-sm ${
                                                            weatherData?.status === 'warning' || stationData?.status === 'warning'
                                                                ? 'bg-yellow-50'
                                                                : weatherData?.status === 'danger' || weatherData?.status === 'alert' || stationData?.status === 'alert'
                                                                ? 'bg-red-50'
                                                                : 'bg-green-50'
                                                        }`}>
                                                            <div className="flex justify-center mb-2">
                                                                <AlertTriangle
                                                                    className={`w-6 h-6 ${
                                                                        weatherData?.status === 'warning' || stationData?.status === 'warning'
                                                                            ? 'text-yellow-600'
                                                                            : weatherData?.status === 'danger' || weatherData?.status === 'alert' || stationData?.status === 'alert'
                                                                            ? 'text-red-600'
                                                                            : 'text-green-600'
                                                                    }`}
                                                                />
                                                            </div>
                                                            <div className={`text-sm font-medium ${
                                                                weatherData?.status === 'warning' || stationData?.status === 'warning'
                                                                    ? 'text-yellow-800'
                                                                    : weatherData?.status === 'danger' || weatherData?.status === 'alert' || stationData?.status === 'alert'
                                                                    ? 'text-red-800'
                                                                    : 'text-green-800'
                                                            }`}>
                                                                {getStatusText(weatherData?.status || stationData?.status || 'safe')}
                                                            </div>
                                                            <div className={`text-xs mt-1 ${
                                                                weatherData?.status === 'warning' || stationData?.status === 'warning'
                                                                    ? 'text-yellow-600'
                                                                    : weatherData?.status === 'danger' || weatherData?.status === 'alert' || stationData?.status === 'alert'
                                                                    ? 'text-red-600'
                                                                    : 'text-green-600'
                                                            }`}>
                                                                {weatherData?.rainfall !== undefined 
                                                                    ? `Curah hujan: ${parseFloat(weatherData.rainfall).toFixed(1)} ${weatherData.unit || 'mm'}`
                                                                    : stationData?.value !== undefined
                                                                    ? `Curah hujan: ${parseFloat(stationData.value).toFixed(1)} ${stationData.unit || 'mm'}`
                                                                    : 'Data tidak tersedia'
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="text-center p-3 bg-green-50 rounded-lg shadow-sm">
                                                            <div className="flex justify-center mb-2">
                                                                <Activity className="w-6 h-6 text-green-600" />
                                                            </div>
                                                            <div className="text-sm font-medium text-green-800">
                                                                Monitoring Aktif
                                                            </div>
                                                            <div className="text-xs text-green-600 mt-1">
                                                                Data real-time dari sensor
                                                            </div>
                                                        </div>
                                                        <div className="text-center p-3 bg-blue-50 rounded-lg shadow-sm">
                                                            <div className="flex justify-center mb-2">
                                                                <Building2 className="w-6 h-6 text-blue-600" />
                                                            </div>
                                                            <div className="text-sm font-medium text-blue-800">
                                                                Stasiun ARR
                                                            </div>
                                                            <div className="text-xs text-blue-600 mt-1">
                                                                Automatic Rainfall Recorder
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rekomendasi */}
                                            {!isLoadingWeather && (
                                                <div className={`rounded-lg p-4 shadow-sm ${
                                                    weatherData?.status === 'warning' || stationData?.status === 'warning'
                                                        ? 'bg-yellow-50 border border-yellow-200'
                                                        : weatherData?.status === 'danger' || weatherData?.status === 'alert' || stationData?.status === 'alert'
                                                        ? 'bg-red-50 border border-red-200'
                                                        : 'bg-blue-50 border border-blue-200'
                                                }`}>
                                                    <h4 className={`text-lg font-semibold mb-2 ${
                                                        weatherData?.status === 'warning' || stationData?.status === 'warning'
                                                            ? 'text-yellow-800'
                                                            : weatherData?.status === 'danger' || weatherData?.status === 'alert' || stationData?.status === 'alert'
                                                            ? 'text-red-800'
                                                            : 'text-blue-800'
                                                    }`}>
                                                        Rekomendasi
                                                    </h4>
                                                    <ul className={`text-sm space-y-1 ${
                                                        weatherData?.status === 'warning' || stationData?.status === 'warning'
                                                            ? 'text-yellow-700'
                                                            : weatherData?.status === 'danger' || weatherData?.status === 'alert' || stationData?.status === 'alert'
                                                            ? 'text-red-700'
                                                            : 'text-blue-700'
                                                    }`}>
                                                        {weatherData?.status === 'alert' || stationData?.status === 'alert' ? (
                                                            <>
                                                                <li>• Waspada! Curah hujan sangat tinggi - siapkan evakuasi</li>
                                                                <li>• Hindari area yang rawan banjir</li>
                                                                <li>• Koordinasi dengan tim darurat segera</li>
                                                                <li>• Pantau update data setiap 15 menit</li>
                                                            </>
                                                        ) : weatherData?.status === 'warning' || stationData?.status === 'warning' ? (
                                                            <>
                                                                <li>• Waspada terhadap peningkatan intensitas hujan</li>
                                                                <li>• Pantau terus data curah hujan setiap 15 menit</li>
                                                                <li>• Siapkan rencana evakuasi jika curah hujan terus meningkat</li>
                                                                <li>• Koordinasi dengan tim darurat jika diperlukan</li>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <li>• Kondisi cuaca normal - tetap waspada</li>
                                                                <li>• Pantau terus data curah hujan setiap 15 menit</li>
                                                                <li>• Sistem monitoring berfungsi dengan baik</li>
                                                                <li>• Lakukan koordinasi rutin dengan tim</li>
                                                            </>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {activeTab === "monitoring" && (
                                        <Suspense
                                            fallback={
                                                <div className="w-full h-[320px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                                                    <span className="text-gray-500">Loading chart...</span>
                                                </div>
                                            }
                                        >
                                            <MonitoringChart
                                                actualData={chartHistory || []}
                                                predictedData={chartHistory ? chartHistory.slice(1) : []}
                                                width="100%"
                                                height={320}
                                            />
                                        </Suspense>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Sensor - Perkembangan Air Sungai Aktual */}
                        {activeTab === "sensor" && (
                            <Suspense
                                fallback={
                                    <div className="w-full h-[220px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                                        <span className="text-gray-500">Loading chart...</span>
                                    </div>
                                }
                            >
                                <TanggulAktual
                                    stationData={stationData}
                                    chartHistory={chartHistory}
                                    width={560}
                                    height={220}
                                    className="w-full"
                                />
                            </Suspense>
                        )}

                        {/* Kartu kedua: Konfigurasi Prediksi - hanya untuk tab sensor */}
                        {activeTab === "sensor" && (
                            <Suspense
                                fallback={
                                    <div className="w-full h-[220px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                                        <span className="text-gray-500">Loading chart...</span>
                                    </div>
                                }
                            >
                                <PredictionChart
                                    stationData={stationData}
                                    chartHistory={chartHistory}
                                    width={560}
                                    height={220}
                                    className="w-full"
                                />
                            </Suspense>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default DetailPanel;
