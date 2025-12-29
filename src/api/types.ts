export type Device = {
  deviceId: string;
  lastSeenAt: string; // ISO
};

export type GetDevicesResponse = {
  devices: Device[];
  next: string;
}

export type Reading = {
  timestamp: string;
  temperature: number;
  humidity: number;
  powerStatus: boolean;
  fanStatus: boolean;
  heatStatus: boolean;
};

export type ReadingsResponse = {
  deviceId: string;
  readings: Reading[];
};
