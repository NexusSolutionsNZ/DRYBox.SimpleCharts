import { CircularProgress, List, ListItemButton, ListItemText, Paper, Stack, Typography } from "@mui/material";
import type { Device } from "../api/types";
import { useNavigate } from "react-router-dom";

export function DeviceList({ devices }: { devices: Device[] }) {
  const navigate = useNavigate();

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Stack sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={800}>
          Devices
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a device to view readings.
        </Typography>
      </Stack>

      {!devices ? (
        <Stack sx={{ p: 2 }} justifyContent='center' alignItems='center'>
          <CircularProgress />
        </Stack>
      ) : !devices.length ? (
        <Stack sx={{ p: 2 }} justifyContent='center' alignItems='center'>
          <Typography textAlign='center'>No devices found.</Typography>
        </Stack>
      ) : (
        <List disablePadding>
          {devices.map((d) => (
            <ListItemButton
              key={d.deviceId}
              onClick={() => navigate(`/devices/${encodeURIComponent(d.deviceId)}`)}
              sx={{ px: 2, py: 1.5 }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography fontWeight={700}>{d.deviceId}</Typography>
                  </Stack>
                }
                secondary={`Last seen: ${new Date(d.lastSeenAt).toLocaleString()}`}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Paper>
  );
}
