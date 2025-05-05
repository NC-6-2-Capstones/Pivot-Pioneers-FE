import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function QuoteBox() {
  const quote = "Discipline outlasts motivation.";

  return (
    <Card sx={{ maxWidth: 400, margin: "20px auto", backgroundColor: "#f5f5f5" }}>
      <CardContent>
        <Typography variant="h6" align="center">
          {quote}
        </Typography>
      </CardContent>
    </Card>
  );
}