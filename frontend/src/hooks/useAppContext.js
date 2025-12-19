import { useContext } from "react";
import { AppContext } from "@/contexts/AppContext";

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

// ===== Custom Hooks untuk Granular Access =====

/**
 * Hook untuk state dan actions terkait devices
 */
export const useDevices = () => {
    const context = useAppContext();
    return {
        tickerData: context.tickerData,
        setTickerData: context.setTickerData,
        devices: context.devices,
        setDevices: context.setDevices,
    };
};

/**
 * Hook untuk state dan actions terkait station selection
 */
export const useStation = () => {
    const context = useAppContext();
    return {
        selectedStation: context.selectedStation,
        setSelectedStation: context.setSelectedStation,
        currentStationIndex: context.currentStationIndex,
        setCurrentStationIndex: context.setCurrentStationIndex,
        handleStationSelect: context.handleStationSelect,
        handleCloseStationDetail: context.handleCloseStationDetail,
        handleStationChange: context.handleStationChange,
    };
};

/**
 * Hook untuk state dan actions terkait UI (sidebar, detail panel, filter, backdrop)
 */
export const useUI = () => {
    const context = useAppContext();
    return {
        isSidebarOpen: context.isSidebarOpen,
        setIsSidebarOpen: context.setIsSidebarOpen,
        isDetailPanelOpen: context.isDetailPanelOpen,
        setIsDetailPanelOpen: context.setIsDetailPanelOpen,
        isFilterOpen: context.isFilterOpen,
        setIsFilterOpen: context.setIsFilterOpen,
        isBackdropVisible: context.isBackdropVisible,
        setIsBackdropVisible: context.setIsBackdropVisible,
        handleToggleDetailPanel: context.handleToggleDetailPanel,
        handleCloseDetailPanel: context.handleCloseDetailPanel,
        handleToggleFilter: context.handleToggleFilter,
        handleCloseFilter: context.handleCloseFilter,
    };
};

/**
 * Hook untuk state dan actions terkait auto switch
 */
export const useAutoSwitch = () => {
    const context = useAppContext();
    return {
        isAutoSwitchOn: context.isAutoSwitchOn,
        setIsAutoSwitchOn: context.setIsAutoSwitchOn,
        handleAutoSwitchToggle: context.handleAutoSwitchToggle,
        handleAutoSwitch: context.handleAutoSwitch,
    };
};

/**
 * Hook untuk state dan actions terkait map
 */
export const useMap = () => {
    const context = useAppContext();
    return {
        mapRef: context.mapRef,
        activeLayers: context.activeLayers,
        setActiveLayers: context.setActiveLayers,
        handleLayerToggle: context.handleLayerToggle,
    };
};

/**
 * Hook untuk state dan actions terkait search
 */
export const useSearch = () => {
    const context = useAppContext();
    return {
        searchQuery: context.searchQuery,
        setSearchQuery: context.setSearchQuery,
        handleSearch: context.handleSearch,
    };
};
