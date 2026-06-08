const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const version = process.env.APP_VERSION || "v3";
const startedAt = new Date();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "dailyops",
    version,
    uptimeSeconds: Math.round(process.uptime()),
    startedAt: startedAt.toISOString()
  });
});

app.get("/metrics", (req, res) => {
  const uptime = Math.round(process.uptime());
  const memory = process.memoryUsage();

  res.type("text/plain").send([
    "# HELP dailyops_up Whether the DailyOps service is running",
    "# TYPE dailyops_up gauge",
    "dailyops_up 1",
    "# HELP dailyops_uptime_seconds Service uptime in seconds",
    "# TYPE dailyops_uptime_seconds counter",
    `dailyops_uptime_seconds ${uptime}`,
    "# HELP dailyops_memory_heap_used_bytes Node.js heap used bytes",
    "# TYPE dailyops_memory_heap_used_bytes gauge",
    `dailyops_memory_heap_used_bytes ${memory.heapUsed}`
  ].join("\n"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`DailyOps is running on http://localhost:${port}`);
  });
}

module.exports = app;
