import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import { fetchTestData } from "@/services/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // ===== Original State =====
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ===== Devices State =====
    const [tickerData, setTickerData] = useState(null);
    const [devices, setDevices] = useState([]);

    // ===== Station/Selection State =====
    const [selectedStation, setSelectedStation] = useState(null);
    const [currentStationIndex, setCurrentStationIndex] = useState(0);

    // ===== UI State =====
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isBackdropVisible, setIsBackdropVisible] = useState(false);

    // ===== Auto Switch State =====
    const [isAutoSwitchOn, setIsAutoSwitchOn] = useState(false);

    // ===== Map State =====
    const mapRef = useRef(null);
    const [activeLayers, setActiveLayers] = useState({});

    // ===== Search State =====
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const getTestData = async () => {
            try {
                setLoading(true);
                const data = await fetchTestData();
                setTestData(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setTestData(null);
            } finally {
                setLoading(false);
            }
        };

        getTestData();
    }, []);

    // ===== Station Actions =====
    const handleStationSelect = useCallback((station) => {
        setSelectedStation(station);
        setIsSidebarOpen(true);
    }, []);

    const handleCloseStationDetail = useCallback(() => {
        setSelectedStation(null);
        setIsSidebarOpen(false);
        setIsDetailPanelOpen(false);
    }, []);

    const handleStationChange = useCallback(
        (device, index) => {
            const deviceName = device?.name || device?.device_name || device?.station_name;
            console.log('Context: Device change requested:', deviceName, 'index:', index);
            
            if (!device || index === undefined) {
                console.warn('Context: Invalid device or index provided');
                return;
            }
            
            const timeoutId = setTimeout(() => {
                setCurrentStationIndex(index);
                setSelectedStation(device);
                setIsSidebarOpen(true);
                if (isAutoSwitchOn) {
                    setIsDetailPanelOpen(false);
                }
            }, 10);
            
            if (window.mapboxAutoSwitch) {
                try {
                    window.mapboxAutoSwitch(device, index);
                } catch (error) {
                    console.error('Context: Error calling mapboxAutoSwitch:', error);
                }
            }
            
            return () => clearTimeout(timeoutId);
        },
        [isAutoSwitchOn]
    );

    // ===== UI Actions =====
    const handleToggleDetailPanel = useCallback(() => {
        setIsDetailPanelOpen((prev) => !prev);
    }, []);

    const handleCloseDetailPanel = useCallback(() => {
        setIsDetailPanelOpen(false);
    }, []);

    const handleToggleFilter = useCallback(() => {
        setIsFilterOpen((prev) => !prev);
    }, []);

    const handleCloseFilter = useCallback(() => {
        setIsFilterOpen(false);
    }, []);

    // ===== Auto Switch Actions =====
    const handleAutoSwitchToggle = useCallback((isOn) => {
        console.log('=== CONTEXT: AUTO SWITCH TOGGLE REQUESTED ===');
        console.log('Requested state:', isOn);
        
        const timeoutId = setTimeout(() => {
            console.log('Setting isAutoSwitchOn to:', isOn);
            setIsAutoSwitchOn(isOn);
            
            if (!isOn) {
                console.log('Auto switch OFF - closing sidebar');
                handleCloseStationDetail();
            } else {
                console.log('Auto switch ON - closing detail panel');
                setIsDetailPanelOpen(false);
            }
        }, 50);
        
        return () => clearTimeout(timeoutId);
    }, [handleCloseStationDetail]);

    const handleAutoSwitch = useCallback((station, index) => {
        setCurrentStationIndex(index);
        setSelectedStation(station);
        setIsSidebarOpen(true);
    }, []);

    // ===== Map Actions =====
    const handleLayerToggle = useCallback((layerId) => {
        console.log(`Layer toggle requested: ${layerId}`);
        if (mapRef.current?.handleLayerToggle) {
            mapRef.current.handleLayerToggle(layerId);
        }
    }, []);

    // ===== Search Actions =====
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    // ===== Backdrop Control =====
    useEffect(() => {
        const hasModal = selectedStation || isDetailPanelOpen || isFilterOpen;
        
        if (hasModal) {
            setIsBackdropVisible(true);
        } else {
            const timeout = setTimeout(() => {
                setIsBackdropVisible(false);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [selectedStation, isDetailPanelOpen, isFilterOpen]);

    const value = {
        // Original
        testData,
        loading,
        error,
        
        // Devices
        tickerData,
        setTickerData,
        devices,
        setDevices,
        
        // Station
        selectedStation,
        setSelectedStation,
        currentStationIndex,
        setCurrentStationIndex,
        handleStationSelect,
        handleCloseStationDetail,
        handleStationChange,
        
        // UI
        isSidebarOpen,
        setIsSidebarOpen,
        isDetailPanelOpen,
        setIsDetailPanelOpen,
        isFilterOpen,
        setIsFilterOpen,
        isBackdropVisible,
        setIsBackdropVisible,
        handleToggleDetailPanel,
        handleCloseDetailPanel,
        handleToggleFilter,
        handleCloseFilter,
        
        // Auto Switch
        isAutoSwitchOn,
        setIsAutoSwitchOn,
        handleAutoSwitchToggle,
        handleAutoSwitch,
        
        // Map
        mapRef,
        activeLayers,
        setActiveLayers,
        handleLayerToggle,
        
        // Search
        searchQuery,
        setSearchQuery,
        handleSearch,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
