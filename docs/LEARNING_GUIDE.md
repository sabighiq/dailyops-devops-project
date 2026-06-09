# DailyOps DevOps Learning Guide

## Completed Project Flow

```text
Application
-> Git and GitHub
-> Docker
-> Docker Hub
-> Minikube
-> Kubernetes self-healing
-> Rolling updates
-> Helm
-> Prometheus and Grafana
-> Jenkins CI/CD
-> Terraform
-> Azure Container Registry
-> Azure Kubernetes Service
-> Azure Load Balancer
-> Monitoring on AKS
```

## Core Concepts

### Application

- Node.js and Express serve the frontend.
- `/health` supports readiness and liveness probes.
- `/metrics` exposes Prometheus metrics.
- Tests run with `npm test`.

### Git

```text
Working directory -> staging area -> commit -> GitHub
```

Common commands:

```powershell
git status
git add .
git commit -m "message"
git push
```

### Docker

```text
Dockerfile -> image -> running container -> registry
```

```powershell
docker build -t dailyops:v1 .
docker run -d --name dailyops-container -p 8080:3000 dailyops:v1
docker logs dailyops-container
```

### Kubernetes

```text
Deployment -> ReplicaSet -> Pods
Service -> stable network endpoint
```

Important commands:

```powershell
kubectl get nodes
kubectl get pods
kubectl get services
kubectl describe deployment dailyops
kubectl logs deployment/dailyops
kubectl rollout status deployment/dailyops
kubectl rollout undo deployment/dailyops
```

Deleting a pod demonstrates self-healing:

```powershell
kubectl delete pod <pod-name>
kubectl get pods -w
```

### Helm

Helm packages Kubernetes templates and configurable values.

```powershell
helm upgrade --install dailyops ./helm/dailyops
helm list
helm history dailyops
helm rollback dailyops <revision>
```

### Prometheus and Grafana

Prometheus discovers DailyOps through `ServiceMonitor` and scrapes `/metrics`.

Useful queries:

```promql
dailyops_up
dailyops_uptime_seconds
kube_pod_info{namespace="default"}
```

### Jenkins

Poll SCM checks GitHub for new commits. Jenkins then:

```text
Tests -> image build -> ACR push -> Helm upgrade -> AKS rollout
```

The Jenkins build number becomes the immutable image tag.

### Terraform and Azure

Terraform manages:

```text
Resource Group
ACR Basic registry
AKS Free control-plane tier
Single AKS system node
Managed identity
AcrPull assignment
```

Terraform workflow:

```powershell
$env:TF_VAR_subscription_id = az account show --query id -o tsv
terraform init
terraform fmt -check
terraform validate
terraform plan -out plan.tfplan
terraform apply plan.tfplan
```

## Interview Explanation

> I built DailyOps, a Node.js productivity application, and implemented an end-to-end CI/CD platform. GitHub changes are detected by Jenkins, which runs tests, builds a versioned Docker image, pushes it to Azure Container Registry, and deploys it to Azure Kubernetes Service using Helm. Kubernetes provides health checks, self-healing, and rolling updates. Terraform provisions ACR, AKS, managed identity, and registry permissions. Prometheus scrapes application and cluster metrics, which are visualized in Grafana.

## Resume Bullet

> Built an automated CI/CD pipeline using GitHub, Jenkins, Docker, Terraform, Azure Container Registry, AKS, Helm, Prometheus, and Grafana, including versioned image delivery, rolling deployments, self-healing, health probes, public load balancing, and application monitoring.
