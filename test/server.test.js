const assert = require("node:assert");
const test = require("node:test");
const request = require("supertest");
const app = require("../src/server");

test("GET /health returns service health", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "dailyops");
  assert.equal(typeof response.body.uptimeSeconds, "number");
});

test("GET /metrics returns prometheus-style metrics", async () => {
  const response = await request(app).get("/metrics");

  assert.equal(response.status, 200);
  assert.match(response.text, /dailyops_up 1/);
  assert.match(response.text, /dailyops_uptime_seconds/);
});
