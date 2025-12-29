import type { PropsWithChildren } from "react";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import { Link as RouterLink } from "react-router-dom";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar>
          <InsightsIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: "inherit", textDecoration: "none", fontWeight: 700 }}
          >
            Device Readings
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
