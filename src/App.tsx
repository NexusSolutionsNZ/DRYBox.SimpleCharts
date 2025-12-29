import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { DevicesPage } from "./pages/DevicesPage";
import { DeviceDetailPage } from "./pages/DeviceDetailPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DevicesPage />} />
        <Route path="/devices/:deviceId" element={<DeviceDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
