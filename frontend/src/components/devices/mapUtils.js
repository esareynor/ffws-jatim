// src/components/devices/mapUtils.js
// Utilities extracted from MapboxMap for readability and reuse

export const REGION_ID_TO_DEVICE_ID = {
    "ws-baru-bajul-mati": 9,
    "ws-bengawan-solo": 8,
    "ws-bondoyudo-bedadung": 5,
    "ws-brantas": 10,
    "ws-pekalen-sampean": 7,
    "ws-welang-rejoso": 6,
    "ws-madura-bawean": 11,
};

export const DEVICE_ID_TO_COLOR = {
    9: "#8A2BE2",
    8: "#FF7F50",
    5: "#00CED1",
    10: "#FF4500",
    7: "#FF69B4",
    6: "#FF00FF",
    11: "#FFD700",
};

export const getBBox = (geometry) => {
    const bounds = [
        [Infinity, Infinity],
        [-Infinity, -Infinity],
    ];
    const traverse = (arr) => {
        if (arr.length === 2 && typeof arr[0] === "number" && typeof arr[1] === "number") {
            bounds[0][0] = Math.min(bounds[0][0], arr[0]);
            bounds[0][1] = Math.min(bounds[0][1], arr[1]);
            bounds[1][0] = Math.max(bounds[1][0], arr[0]);
            bounds[1][1] = Math.max(bounds[1][1], arr[1]);
        } else arr.forEach(traverse);
    };
    traverse(geometry.coordinates);
    return bounds;
};

const pointInRing = (x, y, ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0],
            yi = ring[i][1];
        const xj = ring[j][0],
            yj = ring[j][1];
        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
};

export const pointInPolygon = (point, polygon) => {
    const x = point[0],
        y = point[1];
    if (!Array.isArray(polygon) || polygon.length === 0) return false;
    if (pointInRing(x, y, polygon[0]) === false) return false;
    for (let i = 1; i < polygon.length; i++) {
        if (pointInRing(x, y, polygon[i])) return false;
    }
    return true;
};

export const pointInGeoJSON = (geojson, point) => {
    if (!geojson || !geojson.type) return false;
    const coords = point; // [lng, lat]
    if (geojson.type === "FeatureCollection") {
        return geojson.features.some((f) => pointInGeoJSON(f, coords));
    }
    if (geojson.type === "Feature") {
        return pointInGeoJSON(geojson.geometry, coords);
    }
    if (geojson.type === "Polygon") {
        return pointInPolygon(coords, geojson.coordinates);
    }
    if (geojson.type === "MultiPolygon") {
        return geojson.coordinates.some((poly) => pointInPolygon(coords, poly));
    }
    return false;
};

export const getStatusColor = (status) => {
    switch (status) {
        case "safe":
            return "#10B981";
        case "warning":
            return "#F59E0B";
        case "alert":
            return "#EF4444";
        default:
            return "#6B7280";
    }
};

const svgs = {
    safe: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9V13M12 17.0195V17M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    alert: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 7.25V13M12 16.75V16.76M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    default: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/></svg>`,
    upt: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    ws: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    awlr: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

export const getMarkerStyle = (stationName) => {
    if (!stationName) return { color: getStatusColor("default"), icon: svgs.default, type: "default" };
    if (stationName.includes("UPT")) {
        return { color: "#1F2937", icon: svgs.upt, type: "upt" };
    }
    if (stationName.includes("WS") || stationName.startsWith("BS")) {
        return { color: "#10B981", icon: svgs.ws, type: "ws" };
    }
    if (stationName.startsWith("AWLR")) {
        return { color: "#F59E0B", icon: svgs.awlr, type: "awlr" };
    }
    return { color: getStatusColor("default"), icon: svgs.default, type: "default" };
};

export const getButtonStyleOverride = ({
    isHujanJamJamActive,
    isPosDugaJamJamActive,
    isHujanBrantasActive,
    isDugaAirBrantasActive,
    isDugaAirBengawanSoloActive,
    isBengawanSoloPJT1Active,
}) => {
    if (isPosDugaJamJamActive) return { color: "#0369A1", shape: "rounded-square", icon: svgs.awlr };
    if (isHujanJamJamActive) return { color: "#1E90FF", shape: "pin", icon: svgs.safe };
    if (isHujanBrantasActive) return { color: "#DC2626", shape: "circle", icon: svgs.warning };
    if (isDugaAirBrantasActive) return { color: "#F59E0B", shape: "diamond", icon: svgs.awlr };
    if (isDugaAirBengawanSoloActive) return { color: "#10B981", shape: "triangle", icon: svgs.ws };
    if (isBengawanSoloPJT1Active) return { color: "#7C3AED", shape: "circle-with-square", icon: svgs.upt };
    return null;
};

export const getUptIdFromStationName = (stationName) => {
    if (!stationName) return null;
    const uptMapping = {
        "UPT PSDA Welang Pekalen Pasuruan": "upt-welang-pekalen",
        "UPT PSDA Madura Pamekasan": "upt-madura",
        "UPT PSDA Bengawan Solo Bojonegoro": "upt-bengawan-solo",
        "UPT PSDA Brantas Kediri": "upt-brantas",
        "UPT PSDA Sampean Setail Bondowoso": "upt-sampean",
        "Dinas PUSDA Jatim": "dinas-pusda",
        "ARR Wagir": "pos-hujan-ws-brantas-pjt1",
        "ARR Tangkil": "pos-hujan-ws-brantas-pjt1",
        "ARR Poncokusumo": "pos-hujan-ws-brantas-pjt1",
        "ARR Dampit": "pos-hujan-ws-brantas-pjt1",
        "ARR Sengguruh": "pos-hujan-ws-brantas-pjt1",
        "ARR Sutami": "pos-hujan-ws-brantas-pjt1",
        "ARR Tunggorono": "pos-hujan-ws-brantas-pjt1",
        "ARR Doko": "pos-hujan-ws-brantas-pjt1",
        "ARR Birowo": "pos-hujan-ws-brantas-pjt1",
        "ARR Wates Wlingi": "pos-hujan-ws-brantas-pjt1",
        "Semen ARR": "pos-hujan-ws-brantas-pjt1",
        "ARR Sumberagung": "pos-hujan-ws-brantas-pjt1",
        "Bendungan ARR Wlingi": "pos-hujan-ws-brantas-pjt1",
        "ARR Tugu": "pos-hujan-ws-brantas-pjt1",
        "ARR Kampak": "pos-hujan-ws-brantas-pjt1",
        "ARR Bendo": "pos-hujan-ws-brantas-pjt1",
        "ARR Pagerwojo": "pos-hujan-ws-brantas-pjt1",
        "ARR Kediri": "pos-hujan-ws-brantas-pjt1",
        "ARR Tampung": "pos-hujan-ws-brantas-pjt1",
        "ARR Gunung Sari": "pos-hujan-ws-brantas-pjt1",
        "ARR Metro": "pos-hujan-ws-brantas-pjt1",
        "ARR Gemarang": "pos-hujan-ws-brantas-pjt1",
        "ARR Bendungan": "pos-hujan-ws-brantas-pjt1",
        "ARR Tawangsari": "pos-hujan-ws-brantas-pjt1",
        "ARR Sadar": "pos-hujan-ws-brantas-pjt1",
        "ARR Bogel": "pos-hujan-ws-brantas-pjt1",
        "ARR Karangpilang": "pos-hujan-ws-brantas-pjt1",
        "ARR Kedurus": "pos-hujan-ws-brantas-pjt1",
        "ARR Wonorejo-1": "pos-hujan-ws-brantas-pjt1",
        "ARR Wonorejo-2": "pos-hujan-ws-brantas-pjt1",
        "ARR Rejotangan": "pos-hujan-ws-brantas-pjt1",
        "ARR Kali Biru": "pos-hujan-ws-brantas-pjt1",
        "ARR Neyama": "pos-hujan-ws-brantas-pjt1",
        "ARR Selorejo": "pos-hujan-ws-brantas-pjt1",
    };
    for (const [name, id] of Object.entries(uptMapping)) {
        if (stationName.includes(name)) return id;
    }
    return null;
};

export const extractKeywords = (list) =>
    list.map((name) => {
        const parts = name.split(" ");
        return parts[parts.length - 1];
    });
