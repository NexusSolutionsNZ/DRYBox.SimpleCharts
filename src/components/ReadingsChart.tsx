import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createChart,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
  type LineData,
} from "lightweight-charts";
import { Paper, Typography, Tabs, Tab, Box } from "@mui/material";
import type { Reading } from "../api/types";

const READING_SERIES_KEYS = [
  "temperature",
  "humidity",
  "fanStatus",
  "heatStatus",
  "powerStatus",
] as const;

type SeriesKeys = (typeof READING_SERIES_KEYS)[number];

function toUtcTimestampSeconds(iso: string): UTCTimestamp {
  return Math.floor(new Date(iso).getTime() / 1000) as UTCTimestamp;
}

const SERIES_COLORS: Record<SeriesKeys, string> = {
  temperature: "#ff6b6b",
  humidity: "#4dabf7",
  fanStatus: "#51cf66",
  heatStatus: "#ffa94d",
  powerStatus: "#845ef7",
};

function buildSeriesData(
  readings: Reading[] | undefined,
  key: SeriesKeys
): LineData<UTCTimestamp>[] {
  // Deduplicate by timestamp (seconds) – keep the latest reading for that second
  const byTime = new Map<number, number>();

  for (const r of readings ?? []) {
    const t = toUtcTimestampSeconds(r.timestamp) as unknown as number;
    const raw = r[key];

    const value =
      typeof raw === "boolean" ? (raw ? 1 : 0) : (raw as number | undefined);

    if (typeof value !== "number" || Number.isNaN(value)) continue;

    byTime.set(t, value);
  }

  const out: LineData<UTCTimestamp>[] = Array.from(byTime.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([time, value]) => ({ time: time as UTCTimestamp, value }));

  // Now strictly increasing (no duplicates), so lightweight-charts is happy.
  return out;
}

export function ReadingsChart({
  title,
  readings,
}: {
  title: string;
  readings: Reading[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [selectedKey, setSelectedKey] = useState<SeriesKeys>("temperature");

  const seriesDataByKey = useMemo(() => {
    const acc = {} as Record<SeriesKeys, LineData<UTCTimestamp>[]>;
    for (const key of READING_SERIES_KEYS) {
      acc[key] = buildSeriesData(readings, key);
    }
    return acc;
  }, [readings]);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height: 360,
      autoSize: true,
      layout: {
        background: { color: "transparent" },
        textColor: "#7b7b7b",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, secondsVisible: true, timeVisible: true },
      crosshair: { vertLine: { visible: true }, horzLine: { visible: true } },
    });

    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Update the displayed series when tab changes or data changes
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // remove previous series (so we only show one at a time)
    if (seriesRef.current) {
      chart.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    const data = seriesDataByKey[selectedKey];
    const s = chart.addSeries(LineSeries, {
      lineWidth: 2,
      color: SERIES_COLORS[selectedKey]
    });

    s.setData(data);
    seriesRef.current = s;

    chart.timeScale().fitContent();
  }, [selectedKey, seriesDataByKey]);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="subtitle1" fontWeight={800}>
          {title}
        </Typography>

        <Tabs
          value={selectedKey}
          onChange={(_, v) => setSelectedKey(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: 36 }}
        >
          {READING_SERIES_KEYS.map((k) => (
            <Tab
              key={k}
              value={k}
              label={k}
              sx={{
                minHeight: 36,
                textTransform: "none",
                fontWeight: 700,
              }}
            />
          ))}
        </Tabs>
      </Box>

      <div ref={containerRef} style={{ width: "100%" }} />
    </Paper>
  );
}
