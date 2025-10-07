import React, { useState, useEffect, useRef, useCallback } from "react";

const AutoSwitchToggle = ({
    tickerData,
    onStationChange,
    currentStationIndex,
    onAutoSwitchToggle,
    interval = 5000,
    stopDelay = 5000,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(currentStationIndex ?? 0);
    const [isPendingStop, setIsPendingStop] = useState(false);
    const [isAtMarker, setIsAtMarker] = useState(true);
    const intervalRef = useRef(null);
    const stopTimeoutRef = useRef(null);
    const tickerDataRef = useRef(tickerData);
    
    // Perbarui ref saat tickerData berubah dan urutkan berdasarkan ID
    useEffect(() => {
        const sortedData = tickerData ? [...tickerData].sort((a, b) => a.id - b.id) : [];
        tickerDataRef.current = sortedData;
        
        if (sortedData && sortedData.length > 0) {
            setCurrentIndex(prev => prev >= sortedData.length ? 0 : prev);
        }
    }, [tickerData]);
    
    // Hentikan auto switch jika data kosong
    useEffect(() => {
        if (isPlaying && (!tickerData || tickerData.length === 0)) {
            console.log("Ticker data is empty, stopping auto switch");
            stopAutoSwitchImmediately();
        }
    }, [tickerData, isPlaying]);
    
    const tick = useCallback(() => {
        const currentTickerData = tickerDataRef.current;
        if (!currentTickerData || currentTickerData.length === 0) {
            console.warn("Tick called but no ticker data available");
            return;
        }

        setIsAtMarker(false);

        setCurrentIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % currentTickerData.length;
            const nextStation = currentTickerData[nextIndex];

            console.log(`Tick: Switching from index ${prevIndex} to ${nextIndex}, station: ${nextStation?.name}`);

            if (typeof window.mapboxAutoSwitch === 'function' && nextStation) {
                console.log("Auto switching to next station:", nextStation.name);
                try {
                    window.mapboxAutoSwitch(nextStation, nextIndex);
                    
                    setTimeout(() => {
                        setIsAtMarker(true);
                    }, 1000);
                } catch (error) {
                    console.error("Error calling mapboxAutoSwitch:", error);
                    setIsAtMarker(true);
                }
            } else {
                console.warn("mapboxAutoSwitch is not available or station is undefined");
                setIsAtMarker(true);
            }

            if (onStationChange) {
                onStationChange(nextStation, nextIndex);
            }

            return nextIndex;
        });
    }, [onStationChange]);

    // Fungsi untuk menghentikan auto switch segera tanpa delay
    const stopAutoSwitchImmediately = useCallback(() => {
        console.log("Stopping auto switch immediately");
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
        }
        
        setIsPlaying(false);
        setIsPendingStop(false);
        setIsAtMarker(true);
        
        document.dispatchEvent(
            new CustomEvent("autoSwitchDeactivated", {
                detail: { active: false },
            })
        );
        
        if (onAutoSwitchToggle) {
            onAutoSwitchToggle(false);
        }
    }, [onAutoSwitchToggle]);

    useEffect(() => {
        console.log("AutoSwitchToggle effect running, isPlaying:", isPlaying);
        
        if (intervalRef.current) {
            console.log("Clearing existing interval");
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        if (isPlaying) {
            if (stopTimeoutRef.current) {
                console.log("Clearing pending stop timeout");
                clearTimeout(stopTimeoutRef.current);
                stopTimeoutRef.current = null;
                setIsPendingStop(false);
            }

            if (tickerDataRef.current && tickerDataRef.current.length > 0) {
                const currentData = tickerDataRef.current;
                const firstStation = currentData[currentIndex];
                
                setIsAtMarker(false);
                
                if (typeof window.mapboxAutoSwitch === 'function' && firstStation) {
                    console.log("Initial auto switch to station:", firstStation.name, "at index:", currentIndex);
                    try {
                        window.mapboxAutoSwitch(firstStation, currentIndex);
                        
                        setTimeout(() => {
                            setIsAtMarker(true);
                        }, 1000);
                    } catch (error) {
                        console.error("Error on initial switch:", error);
                        setIsAtMarker(true);
                    }
                } else {
                    console.warn("Cannot perform initial switch: mapboxAutoSwitch not available or no station data");
                    setIsAtMarker(true);
                }
                
                tick();
                
                console.log(`Starting new interval with ${interval}ms delay`);
                intervalRef.current = setInterval(() => tick(), interval);
                
                document.dispatchEvent(
                    new CustomEvent("autoSwitchActivated", {
                        detail: { active: true, currentIndex, stationCount: currentData.length },
                    })
                );
            } else {
                console.warn("Cannot start auto switch: No ticker data available");
                stopAutoSwitchImmediately();
            }
        } else if (!isPendingStop) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                
                console.log("Auto switch interval cleared due to isPlaying = false");
                
                document.dispatchEvent(
                    new CustomEvent("autoSwitchDeactivated", {
                        detail: { active: false },
                    })
                );
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (stopTimeoutRef.current) {
                clearTimeout(stopTimeoutRef.current);
                stopTimeoutRef.current = null;
            }
        };
    }, [isPlaying, isPendingStop, interval, tick, stopAutoSwitchImmediately]);

    const startAutoSwitch = () => {
        const currentData = tickerDataRef.current;
        if (!currentData || currentData.length === 0) {
            console.warn("Cannot start auto switch: No ticker data available");
            return;
        }
        
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
            setIsPendingStop(false);
        }
        
        console.log("Auto switch starting. Available stations:", currentData.length);
        if (currentData.length > 0) {
            console.log("Station names:", currentData.map(s => s.name).join(", "));
        }
        console.log("Starting with station index:", currentIndex);
        
        if (typeof window.mapboxAutoSwitch !== 'function') {
            console.warn("mapboxAutoSwitch function is not available on window object!");
            console.log("Window object functions:", Object.keys(window).filter(key => typeof window[key] === 'function'));
        }
        
        setIsPlaying(true);
    };

    const stopAutoSwitch = () => {
        if (isPendingStop) {
            console.log("Already pending stop, ignoring stopAutoSwitch call");
            return;
        }
        
        console.log("Auto switch will stop in", stopDelay/1000, "seconds");
        setIsPendingStop(true);
        
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
        }
        
        stopTimeoutRef.current = setTimeout(() => {
            stopAutoSwitchImmediately();
        }, stopDelay);
    };

    const togglePlayPause = () => {
        console.log("Toggle play/pause called. Current state - isPlaying:", isPlaying, "isPendingStop:", isPendingStop);
        
        if (isPendingStop) {
            if (stopTimeoutRef.current) {
                clearTimeout(stopTimeoutRef.current);
                stopTimeoutRef.current = null;
            }
            setIsPendingStop(false);
            console.log("Auto switch stop cancelled, continuing");
            return;
        }
        
        const newIsPlaying = !isPlaying;
        console.log("Setting isPlaying to:", newIsPlaying);
        
        if (newIsPlaying) {
            startAutoSwitch();
        } else {
            stopAutoSwitchImmediately();
        }
        
        if (onAutoSwitchToggle) {
            onAutoSwitchToggle(newIsPlaying);
        }
    };

    // Sinkronisasi dengan external currentStationIndex
    useEffect(() => {
        if (currentStationIndex !== undefined && currentStationIndex !== currentIndex) {
            console.log("Syncing with external currentStationIndex:", currentStationIndex);
            setCurrentIndex(currentStationIndex);
            
            if (isPlaying && tickerDataRef.current && tickerDataRef.current.length > 0) {
                const station = tickerDataRef.current[currentStationIndex];
                if (station && typeof window.mapboxAutoSwitch === 'function') {
                    console.log("Auto updating to new index station:", station.name);
                    
                    setIsAtMarker(false);
                    
                    window.mapboxAutoSwitch(station, currentStationIndex);
                    
                    setTimeout(() => {
                        setIsAtMarker(true);
                    }, 1000);
                }
            }
        }
    }, [currentStationIndex]);

    // Event listener
    useEffect(() => {
        const handleUserInteraction = (event) => {
            if (isPlaying && !isPendingStop) {
                console.log("User interaction detected, starting stop delay:", event.detail);
                stopAutoSwitch();
                
                const filterButton = document.querySelector('[aria-label="Buka Filter"]');
                if (filterButton) {
                    filterButton.style.backgroundColor = "white";
                }
            }
        };

        document.addEventListener("userInteraction", handleUserInteraction);
        
        const logAutoSwitchEvent = (event) => {
            console.log("Auto switch event received:", event.type, event.detail);
        };
        
        const handleMapboxReady = (event) => {
            console.log("Received mapboxReadyForAutoSwitch event:", event.detail);
            
            if (isPlaying && !intervalRef.current && tickerDataRef.current?.length > 0) {
                console.log("Restarting tick interval after mapbox confirmation");
                
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                
                setIsAtMarker(false);
                
                tick();
                
                intervalRef.current = setInterval(() => tick(), interval);
            }
        };
        
        document.addEventListener("autoSwitchActivated", logAutoSwitchEvent);
        document.addEventListener("autoSwitchDeactivated", logAutoSwitchEvent);
        document.addEventListener("mapboxReadyForAutoSwitch", handleMapboxReady);

        return () => {
            document.removeEventListener("userInteraction", handleUserInteraction);
            document.removeEventListener("autoSwitchActivated", logAutoSwitchEvent);
            document.removeEventListener("autoSwitchDeactivated", logAutoSwitchEvent);
            document.removeEventListener("mapboxReadyForAutoSwitch", handleMapboxReady);
        };
    }, [isPlaying, isPendingStop, interval, tick]);

    const hasData = tickerData && tickerData.length > 0;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <span className="text-sm font-semibold text-gray-800">Auto Switch</span>
                
                <div className="flex items-center gap-2">
                    {isPlaying && !isPendingStop && (
                        <div className="flex items-center gap-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${isAtMarker ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-ping'}`}></div>
                            <span className={`text-xs font-medium ${isAtMarker ? 'text-green-600' : 'text-yellow-600'}`}>
                                {isAtMarker ? 'At Marker' : 'Moving...'}
                            </span>
                        </div>
                    )}
                    {isPendingStop && (
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping"></div>
                            <span className="text-xs font-medium text-yellow-600">Stopping...</span>
                        </div>
                    )}
                    {!isPlaying && !isPendingStop && (
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-500">Inactive</span>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={togglePlayPause}   
                disabled={!hasData}
                className={`relative inline-flex items-center h-7 rounded-full transition-all duration-200 ease-in-out focus:outline-none select-none ${
                    !hasData ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
                }`}
                title={isPendingStop ? "Cancel stop" : isPlaying ? "Stop Auto Switch" : "Start Auto Switch"}
                aria-label={isPendingStop ? "Cancel auto switch stop" : isPlaying ? "Stop auto switch" : "Start auto switch"}
            >
                <div
                    className={`relative w-12 h-7 rounded-full transition-all duration-200 ease-in-out ${
                        isPendingStop ? "bg-yellow-400" : 
                        isPlaying ? "bg-green-500" : "bg-gray-300"
                    }`}
                >
                    <div
                        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-200 ease-in-out ${
                            isPlaying || isPendingStop ? "translate-x-5" : "translate-x-0"
                        } ${isPendingStop ? "animate-pulse" : ""}`}
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-md border border-gray-200"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/90 to-transparent"></div>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default AutoSwitchToggle;