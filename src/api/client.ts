import type { GetDevicesResponse, ReadingsResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";

async function http<T>(method: 'GET' | 'POST', path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'omit',
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  return (await res.json()) as T;
}

// Example endpoints:
// GET  /devices
// GET  /devices/:id/readings?from=2025-12-01T00:00:00.000Z&to=2025-12-29T23:59:59.999Z
export function getDevices(): Promise<GetDevicesResponse> {
  return http<GetDevicesResponse>('GET', "/devices");
}

export function getDeviceReadings(params: {
  deviceId: string;
  fromIso: string;
  toIso: string;
}): Promise<ReadingsResponse> {
  const { deviceId, fromIso, toIso } = params;
  const qs = new URLSearchParams({ from: fromIso, to: toIso }).toString();
  return http<ReadingsResponse>('GET', `/devices/${encodeURIComponent(deviceId)}/readings?${qs}`);
}
