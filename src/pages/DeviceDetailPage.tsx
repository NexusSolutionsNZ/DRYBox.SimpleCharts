import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Breadcrumbs, CircularProgress, Link, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getDeviceReadings } from "../api/client";
import { RangePicker } from "../components/RangePicker";
import { ReadingsChart } from "../components/ReadingsChart";
import { defaultLast7DaysRange, rangeToIso } from "../components/helpers";
import { type Range } from '../components/types';

export function DeviceDetailPage() {
  const { deviceId = "" } = useParams();

  const [range, setRange] = useState<Range>(() => defaultLast7DaysRange());
  const iso = useMemo(() => rangeToIso(range), [range]);

  // apply button triggers refetch by bumping key
  const [applyCounter, setApplyCounter] = useState(0);

  const q = useQuery({
    queryKey: ["readings", deviceId, iso.fromIso, iso.toIso, applyCounter],
    queryFn: () =>
      getDeviceReadings({
        deviceId,
        fromIso: iso.fromIso,
        toIso: iso.toIso,
      }),
    enabled: Boolean(deviceId),
  });

  return (
    <Stack spacing={2}>
      <Breadcrumbs>
        <Link underline="hover" color="inherit" href="/">
          Devices
        </Link>
        <Typography color="text.primary">{deviceId}</Typography>
      </Breadcrumbs>

      <Typography variant="h5" fontWeight={900}>
        Device: {deviceId}
      </Typography>

      <RangePicker
        value={range}
        onChange={setRange}
        onApply={() => setApplyCounter((x) => x + 1)}
      />

      {q.isLoading && <CircularProgress />}
      {q.isError && <Alert severity="error">{(q.error as Error).message}</Alert>}

      {q.data && (
        <ReadingsChart
          title={`Readings (${new Date(iso.fromIso).toLocaleDateString()} → ${new Date(iso.toIso).toLocaleDateString()})`}
          readings={q.data.readings}
        />
      )}
    </Stack>
  );
}
