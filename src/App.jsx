import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WasteIntake from "./pages/WasteIntake";
import Emissions from "./pages/Emissions";
import AshOfftake from "./pages/AshOfftake";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function AuthGate({ children }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Login />;
  return children;
}

function Shell() {
  return (
    <div className="flex h-screen bg-base-bg text-text-primary font-body overflow-hidden">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/intake" element={<WasteIntake />} />
        <Route path="/emissions" element={<Emissions />} />
        <Route path="/ash" element={<AshOfftake />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AuthGate>
          <Shell />
        </AuthGate>
      </HashRouter>
    </AppProvider>
  );
}