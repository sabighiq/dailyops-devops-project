# DailyOps

DailyOps is a modern personal productivity dashboard built for learning a complete DevOps CI/CD flow.

## Features

- Today task tracker
- Habit tracker
- Water tracker
- Quick expense log
- Focus timer
- `/health` endpoint for Kubernetes health checks
- `/metrics` endpoint for Prometheus

## Run Locally

```powershell
npm install
npm start
```

Open `http://localhost:3000`.

## Test

```powershell
npm test
```

## Docker

```powershell
docker build -t dailyops .
docker run -p 3000:3000 dailyops
```

## DevOps Flow

```text
GitHub -> Jenkins -> Tests -> Docker Build -> Registry -> Helm Deploy -> Kubernetes -> Prometheus -> Grafana
```

## Learning Guide

Follow `docs/LEARNING_GUIDE.md` for the complete beginner-to-end project path.
