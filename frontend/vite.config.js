import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            jsxRuntime: "automatic",
            jsxImportSource: "react",
        }),
    ],
    server: {
        port: 3000,
        open: true,
        cors: true,
        // Optimasi untuk development
        hmr: {
            overlay: false, // Disable error overlay untuk performa lebih baik
        },
        // Pre-bundle dependencies untuk loading yang lebih cepat
        optimizeDeps: {
            include: ["react", "react-dom", "react-router-dom", "mapbox-gl", "recharts", "shpjs"],
            // Exclude dependencies yang tidak perlu di-pre-bundle
            exclude: ["@vite/client", "@vite/env"],
        },
    },
    build: {
        outDir: "dist",
        sourcemap: false, // Disable sourcemap untuk build yang lebih cepat
        // Optimasi chunk splitting yang lebih granular
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Vendor chunks
                    if (id.includes("node_modules")) {
                        // React ecosystem
                        if (id.includes("react") || id.includes("react-dom")) {
                            return "react-vendor";
                        }
                        // Mapbox GL
                        if (id.includes("mapbox-gl")) {
                            return "mapbox-vendor";
                        }
                        // Charts library
                        if (id.includes("recharts")) {
                            return "charts-vendor";
                        }
                        // Router
                        if (id.includes("react-router")) {
                            return "router-vendor";
                        }
                        // Shapefile processing
                        if (id.includes("shpjs")) {
                            return "geo-vendor";
                        }
                        // Other vendor libraries
                        return "vendor";
                    }

                    // Application chunks berdasarkan fitur
                    if (id.includes("src/components/common")) {
                        return "common-components";
                    }
                    if (id.includes("src/components/sensors")) {
                        return "sensor-components";
                    }
                    if (id.includes("src/components/layout")) {
                        return "layout-components";
                    }
                    if (id.includes("src/components/devices")) {
                        return "device-components";
                    }
                    if (id.includes("src/services")) {
                        return "services";
                    }
                    if (id.includes("src/contexts")) {
                        return "contexts";
                    }
                    if (id.includes("src/pages")) {
                        return "pages";
                    }
                },
                // Optimasi nama file chunk
                chunkFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId
                        ? chunkInfo.facadeModuleId.split("/").pop().replace(".jsx", "").replace(".js", "")
                        : "chunk";
                    return `js/[name]-[hash].js`;
                },
                entryFileNames: "js/[name]-[hash].js",
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split(".");
                    const ext = info[info.length - 1];
                    if (/\.(css)$/.test(assetInfo.name)) {
                        return `css/[name]-[hash].${ext}`;
                    }
                    return `assets/[name]-[hash].${ext}`;
                },
            },
        },
        // Optimasi minification
        minify: false,
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true,
                pure_funcs: ["console.log", "console.info", "console.debug"],
            },
            mangle: {
                safari10: true,
            },
        },
        // Target modern browsers untuk optimasi lebih baik
        target: "esnext",
        // Chunk size warning limit
        chunkSizeWarningLimit: 1000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
        },
    },
    // Optimasi untuk development
    esbuild: {
        logOverride: { "this-is-undefined-in-esm": "silent" },
    },
    // Optimasi CSS
    css: {
        devSourcemap: false,
    },
});
