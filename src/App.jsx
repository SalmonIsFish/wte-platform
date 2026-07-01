import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import WasteIntake from "./pages/WasteIntake";
import Emissions from "./pages/Emissions";
import AshOfftake from "./pages/AshOfftake";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex h-screen bg-base-bg text-text-primary font-body overflow-hidden">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/intake" element={<WasteIntake />} />
            <Route path="/emissions" element={<Emissions />} />
            <Route path="/ash" element={<AshOfftake />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </HashRouter>
    </AppProvider>
  );
}
