# DailyOps

DailyOps is a personal productivity dashboard and an end-to-end DevOps learning project.

## Application Features

- Daily task tracker
- Habit tracker
- Water tracker
- Expense log
- Focus timer
- `/health` endpoint for probes
- `/metrics` endpoint for Prometheus

## Architecture

```text
Developer
   |
   v
GitHub Repository
   |
   | Poll SCM
   v
Jenkins Pipeline
   |
   +--> npm ci
   +--> npm test
   +--> docker build
   +--> push image to Azure Container Registry
   +--> helm upgrade
   |
   v
Azure Kubernetes Service
   |
   +--> 2 DailyOps pods
   +--> Readiness and liveness probes
   +--> Azure Load Balancer
   +--> ServiceMonitor
   |
   v
Prometheus --> Grafana
```

Terraform provisions:

```text
Azure Resource Group
Azure Container Registry
Azure Kubernetes Service
Managed Identity and AcrPull role
```

## CI/CD Pipeline

The [Jenkinsfile](Jenkinsfile) performs:

```text
Checkout
Install dependencies
Run tests
Build image tagged with Jenkins BUILD_NUMBER
Push image to ACR
Deploy to AKS with Helm
Wait for Kubernetes rolling update
```

Required Jenkins credential:

```text
ID: azure-acr-creds
Type: Username with password
Username: Azure service principal application ID
Password: Azure service principal secret
```

## Run Locally

```powershell
npm install
npm test
$env:PORT=5000
npm start
```

Open `http://localhost:5000`.

## Run with Docker

```powershell
docker build -t dailyops:local .
docker run --name dailyops-local -p 8080:3000 dailyops:local
```

## Deploy with Helm

```powershell
helm upgrade --install dailyops ./helm/dailyops `
  --set image.repository=<acr-name>.azurecr.io/dailyops `
  --set image.tag=<tag> `
  --set service.type=LoadBalancer
```

## Monitoring Queries

```promql
dailyops_up
dailyops_uptime_seconds
rate(container_cpu_usage_seconds_total{namespace="default",pod=~"dailyops-.*"}[5m])
container_memory_working_set_bytes{namespace="default",pod=~"dailyops-.*"}
```

## Documentation

- [Complete learning guide](docs/LEARNING_GUIDE.md)
- [Operations and cost guide](docs/OPERATIONS.md)
- [Terraform guide](terraform/README.md)

## Security Notes

- Secrets are stored in Jenkins Credentials, not committed to Git.
- ACR admin credentials are disabled.
- AKS pulls images through managed identity and `AcrPull`.
- Terraform state and variable files are excluded from Git.
