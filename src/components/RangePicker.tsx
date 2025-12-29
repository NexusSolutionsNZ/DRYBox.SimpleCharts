import { Stack, TextField, Button, Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import { type Range } from './types';

export function RangePicker({
  value,
  onChange,
  onApply,
}: {
  value: Range;
  onChange: (v: Range) => void;
  onApply: () => void;
}) {
  const [local, setLocal] = useState<Range>(value);

  // keep initial default sensible
  const canApply = useMemo(() => {
    if (!local.from || !local.to) return false;
    return local.from <= local.to;
  }, [local.from, local.to]);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
        Date range
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "end" }}>
        <TextField
          label="From"
          type="datetime-local"
          value={local.from}
          onChange={(e) => setLocal((p) => ({ ...p, from: e.target.value }))}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="To"
          type="datetime-local"
          value={local.to}
          onChange={(e) => setLocal((p) => ({ ...p, to: e.target.value }))}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Button
          variant="contained"
          disableElevation
          disabled={!canApply}
          onClick={() => {
            onChange(local);
            onApply();
          }}
          sx={{ borderRadius: 999, px: 3, whiteSpace: "nowrap" }}
        >
          Apply
        </Button>
      </Stack>
    </Paper>
  );
}
