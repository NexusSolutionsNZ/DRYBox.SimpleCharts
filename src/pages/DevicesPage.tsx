import { useQuery } from "@tanstack/react-query";
import { getDevices } from "../api/client";
import { Alert, CircularProgress, Stack } from "@mui/material";
import { DeviceList } from "../components/DeviceList";

export function DevicesPage() {
  const q = useQuery({
    queryKey: ["devices"],
    queryFn: getDevices,
  });

  if (q.isLoading) return <CircularProgress />;
  if (q.isError) return <Alert severity="error">{(q.error as Error).message}</Alert>;

  return (
    <Stack spacing={2}>
      <DeviceList devices={q.data?.devices ?? []} />
    </Stack>
  );
}
