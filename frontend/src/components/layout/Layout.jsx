import React, { memo, lazy, Suspense } from "react";
import { useStation, useDevices, useUI, useAutoSwitch, useMap, useSearch } from "@/hooks/useAppContext";

const GoogleMapsSearchbar = lazy(() => import("@components/common/GoogleMapsSearchbar"));
const MapboxMap = lazy(() => import("@/components/devices/MapboxMap"));
const FloatingLegend = lazy(() => import("@components/common/FloatingLegend"));
const FloodRunningBar = lazy(() => import("@/components/common/FloodRunningBar"));
const StationDetail = lazy(() => import("@/components/StationDetail"));
const DetailPanel = lazy(() => import("@components/sensors/DetailPanel"));
const FilterPanel = lazy(() => import("@components/common/FilterPanel"));

const Layout = ({ children }) => {
    // ===== Context Hooks - No more prop drilling! =====
    const { selectedStation, currentStationIndex, handleStationSelect, handleCloseStationDetail, handleStationChange } = useStation();
    const { tickerData, setTickerData } = useDevices();
    const { 
        isSidebarOpen, 
        isDetailPanelOpen, 
        isFilterOpen,
        handleToggleDetailPanel, 
        handleCloseDetailPanel,
        setIsFilterOpen 
    } = useUI();
    const { isAutoSwitchOn, handleAutoSwitchToggle, handleAutoSwitch } = useAutoSwitch();
    const { mapRef, handleLayerToggle } = useMap();
    const { handleSearch } = useSearch();

    return (
        <div className="h-screen bg-gray-50 relative overflow-hidden">
            {/* Full Screen Map */}
            <div className="w-full h-full relative z-0">
                <Suspense
                    fallback={
                        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                            Loading Map...
                        </div>
                    }
                >
                    <MapboxMap ref={mapRef} />
                </Suspense>
            </div>

            {/* Google Maps Style Searchbar - fixed position */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-[70] mobile-searchbar">
                <div className="w-auto sm:w-80 h-12">
                    <Suspense fallback={<div className="h-12 bg-white/80 rounded-lg animate-pulse"></div>}>
                        <GoogleMapsSearchbar onSearch={handleSearch} placeholder="Cari stasiun monitoring banjir..." />
                    </Suspense>
                </div>
            </div>

            {/* Flood Running Bar */}
            <Suspense fallback={<div className="h-16 bg-white/80 animate-pulse"></div>}>
                <FloodRunningBar onDataUpdate={setTickerData} />
            </Suspense>

            {/* Bottom-right container for Floating Legend - hidden on mobile */}
            <div className="hidden sm:block absolute bottom-2 right-2 sm:bottom-4 sm:right-2 z-20">
                <Suspense fallback={<div className="h-20 bg-white/80 rounded animate-pulse"></div>}>
                    <FloatingLegend />
                </Suspense>
            </div>

            {/* Backdrop dihapus sesuai permintaan */}

            {/* Station Detail Modal */}
            <Suspense
                fallback={
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 animate-pulse">Loading...</div>
                    </div>
                }
            >
                {selectedStation && <StationDetail />}
            </Suspense>

            {/* Detail Panel */}
            <Suspense
                fallback={<div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg animate-pulse"></div>}
            >
                <DetailPanel />
            </Suspense>

            {/* Right-side Filter Panel */}
            <Suspense fallback={<div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg animate-pulse"></div>}>
                <FilterPanel
                    onOpen={() => setIsFilterOpen(true)}
                    onClose={() => setIsFilterOpen(false)}
                />
            </Suspense>

            {/* Mobile-specific styles */}
            <style>{`
                @media (max-width: 640px) {
                    /* Mobile layout adjustments */
                    .mobile-flood-bar {
                        top: 4rem !important;
                        left: 0.5rem !important;
                        right: 0.5rem !important;
                    }
                    
                    .mobile-searchbar {
                        top: 0.5rem !important;
                        left: 0.5rem !important;
                        right: 3.5rem !important;
                    }
                    
                    /* Hide legend on mobile */
                    .mobile-hide-legend {
                        display: none !important;
                    }
                    
                }
                
                @media (min-width: 641px) {
                    /* Desktop layout - semua komponen sejajar dengan jarak konsisten */
                    .mobile-searchbar {
                        left: 1rem !important;
                    }
                    
                    .desktop-flood-bar {
                        left: calc(1rem + 20rem + 1rem) !important;
                        right: calc(1rem + 3rem + 1rem) !important;
                    }
                }
            `}</style>
        </div>
    );
};

// Memoize Layout component untuk mencegah re-render yang tidak perlu
export default memo(Layout);
