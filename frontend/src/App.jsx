import React from "react";
import { AppProvider } from "@/contexts/AppContext";
import Layout from "@/components/layout/Layout.jsx";
import "@/assets/App.css";

function App() {
    return (
        <AppProvider>
            <Layout />
        </AppProvider>
    );
}

export default App;
