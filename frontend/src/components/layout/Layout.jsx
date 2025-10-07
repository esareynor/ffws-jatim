import React, { useState, useRef, useCallback, memo, lazy, Suspense, useEffect } from "react";
const GoogleMapsSearchbar = lazy(() => import("@components/common/GoogleMapsSearchbar"));
const MapboxMap = lazy(() => import("@/components/MapboxMap"));
const FloatingLegend = lazy(() => import("@components/common/FloatingLegend"));
const FloodRunningBar = lazy(() => import("@/components/common/FloodRunningBar"));
const StationDetail = lazy(() => import("@components/sensors/StationDetail"));
const DetailPanel = lazy(() => import("@components/sensors/DetailPanel"));
const FilterPanel = lazy(() => import("@components/common/FilterPanel"));
const AutoSwitchToggle = lazy(() => import("@components/devices/AutoSwitchToggle"));
const Layout = ({ children }) => {
    const [tickerData, setTickerData] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStation, setSelectedStation] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [currentStationIndex, setCurrentStationIndex] = useState(0);
    const [isAutoSwitchOn, setIsAutoSwitchOn] = useState(false);
    const mapRef = useRef(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Memoize event handlers untuk mencegah re-render yang tidak perlu
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleStationSelect = useCallback((station) => {
        setSelectedStation(station);
        setIsSidebarOpen(true);
    }, []);

    const handleAutoSwitchToggle = useCallback((isOn) => {
        console.log('=== LAYOUT: AUTO SWITCH TOGGLE REQUESTED ===');
        console.log('Requested state:', isOn);
        console.log('Current isAutoSwitchOn:', isAutoSwitchOn);
        console.log('Current tickerData length:', tickerData?.length || 0);
        
        // Debounce untuk mencegah rapid state changes
        const timeoutId = setTimeout(() => {
            console.log('Setting isAutoSwitchOn to:', isOn);
            setIsAutoSwitchOn(isOn);
            
            // If auto switch is turned off, close sidebar
            if (!isOn) {
                console.log('Auto switch OFF - closing sidebar');
                setIsSidebarOpen(false);
                setSelectedStation(null);
            } else {
                console.log('Auto switch ON - closing detail panel');
                // Jika auto switch diaktifkan, tutup detail panel
                setIsDetailPanelOpen(false);
            }
        }, 50);
        
        return () => clearTimeout(timeoutId);
    }, [isAutoSwitchOn, tickerData]);

    const handleCloseStationDetail = useCallback(() => {
        setSelectedStation(null);
        setIsSidebarOpen(false);
    }, []);

    const handleToggleDetailPanel = useCallback(() => {
        if (isDetailPanelOpen) {
            // Jika panel terbuka, tutup dengan animasi
            handleCloseDetailPanel();
        } else {
            // Jika panel tertutup, buka langsung
            setIsDetailPanelOpen(true);
        }
    }, [isDetailPanelOpen]);

    const handleCloseDetailPanel = useCallback(() => {
        setIsDetailPanelOpen(false);
    }, []);

    const handleLayerToggle = useCallback((layerId, enabled) => {
        console.log(`Layer ${layerId} toggled: ${enabled}`);
        // Implementasi logic untuk toggle layer map
        // Bisa dikomunikasikan dengan MapboxMap component
    }, []);

    const handleAutoSwitch = useCallback((station, index) => {
        setCurrentStationIndex(index);
        setSelectedStation(station);
        // Auto open sidebar when auto switching
        setIsSidebarOpen(true);
    }, []);

    const handleStationChange = useCallback(
        (device, index) => {
            const deviceName = device?.name || device?.device_name || device?.station_name;
            console.log('Layout: Device change requested:', deviceName, 'index:', index);
            
            // Validasi input
            if (!device || index === undefined) {
                console.warn('Layout: Invalid device or index provided');
                return;
            }
            
            // Update state dengan debouncing untuk mencegah rapid changes
            const timeoutId = setTimeout(() => {
                setCurrentStationIndex(index);
                // Buka panel detail saat auto switch
                setSelectedStation(device);
                setIsSidebarOpen(true);
                // Tutup detail panel jika auto switch sedang berjalan
                if (isAutoSwitchOn) {
                    setIsDetailPanelOpen(false);
                }
            }, 10);
            
            // Trigger map auto switch (tidak perlu debounce karena ini external call)
            if (window.mapboxAutoSwitch) {
                try {
                    window.mapboxAutoSwitch(device, index);
                } catch (error) {
                    console.error('Layout: Error calling mapboxAutoSwitch:', error);
                }
            }
            
            return () => clearTimeout(timeoutId);
        },
        [isAutoSwitchOn]
    );

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
                    <MapboxMap
                        ref={mapRef}
                        tickerData={tickerData}
                        onStationSelect={handleStationSelect}
                        onAutoSwitch={handleAutoSwitch}
                        isAutoSwitchOn={isAutoSwitchOn}
                        onCloseSidebar={() => {
                            if (!isAutoSwitchOn) {
                                setIsSidebarOpen(false);
                                setSelectedStation(null);
                            }
                        }}
                    />
                </Suspense>
            </div>

            {/* Google Maps Style Searchbar - fixed position */}
            <div className="absolute top-4 left-4 right-4 z-20">
                <div className="max-w-2xl mx-auto">
                    <Suspense fallback={<div className="h-12 bg-white/80 rounded-lg animate-pulse"></div>}>
                        <GoogleMapsSearchbar onSearch={handleSearch} placeholder="Cari stasiun monitoring banjir..." />
                    </Suspense>
                </div>
            </div>

            {/* Flood Running Bar */}
            <Suspense fallback={<div className="h-16 bg-white/80 animate-pulse"></div>}>
                <FloodRunningBar
                    onDataUpdate={setTickerData}
                    onStationSelect={handleStationSelect}
                    isSidebarOpen={isSidebarOpen}
                />
            </Suspense>

            {/* Bottom-right container for Floating Legend only */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-2 z-20">
                <Suspense fallback={<div className="h-20 bg-white/80 rounded animate-pulse"></div>}>
                    <FloatingLegend />
                </Suspense>
            </div>

            {/* Station Detail Modal */}
            <Suspense
                fallback={
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 animate-pulse">Loading...</div>
                    </div>
                }
            >
                <StationDetail
                    selectedStation={selectedStation}
                    onClose={handleCloseStationDetail}
                    tickerData={tickerData}
                    isAutoSwitchOn={isAutoSwitchOn}
                    showArrow={true}
                    onArrowToggle={handleToggleDetailPanel}
                    isDetailPanelOpen={isDetailPanelOpen}
                    onCloseDetailPanel={handleCloseDetailPanel}
                />
            </Suspense>

            {/* Detail Panel */}
            <Suspense
                fallback={<div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg animate-pulse"></div>}
            >
                <DetailPanel
                    isOpen={isDetailPanelOpen}
                    onClose={handleCloseDetailPanel}
                    stationData={selectedStation}
                    chartHistory={selectedStation?.history || []}
                    isAutoSwitchOn={isAutoSwitchOn}
                />
            </Suspense>

            {/* Right-side Filter Panel */}
            <Suspense fallback={<div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg animate-pulse"></div>}>
                <FilterPanel
                    isOpen={isFilterOpen}
                    onOpen={() => setIsFilterOpen(true)}
                />
            </Suspense>
        </div>
    );
};

// Memoize Layout component untuk mencegah re-render yang tidak perlu
export default memo(Layout);
