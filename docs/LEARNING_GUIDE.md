# DailyOps DevOps Learning Guide

This project is your hands-on path for learning a full DevOps CI/CD workflow.

## Phase 1: Run the Application

Goal: understand the app before deploying it.

```powershell
npm install
npm test
npm start
```

Open:

```text
http://localhost:3000
```

Important endpoints:

```text
http://localhost:3000/health
http://localhost:3000/metrics
```

What to learn:

- App runs on port `3000`.
- `/health` is used by Kubernetes health checks.
- `/metrics` is used by Prometheus.

## Phase 2: Docker

Goal: package the app as a container image.

```powershell
docker build -t dailyops:local .
docker run -p 3000:3000 dailyops:local
```

What to learn:

- `Dockerfile`
- image build
- container run
- port mapping

## Phase 3: Kubernetes with Minikube

Goal: deploy the app to a local Kubernetes cluster.

```powershell
minikube start
kubectl apply -f k8s/
kubectl get pods
kubectl get svc
```

What to learn:

- Deployment
- Service
- replicas
- liveness probe
- readiness probe

## Phase 4: Helm

Goal: deploy the app with reusable templates.

```powershell
helm upgrade --install dailyops ./helm/dailyops
helm list
kubectl get pods
```

Change image tag:

```powershell
helm upgrade --install dailyops ./helm/dailyops --set image.tag=build-2
```

What to learn:

- `Chart.yaml`
- `values.yaml`
- Helm templates
- release upgrade

## Phase 5: Jenkins

Goal: automate build, test, image push, and deployment.

Pipeline stages in `Jenkinsfile`:

```text
Checkout Code
Install Dependencies
Run Tests
Build Docker Image
Push Docker Image
Deploy to Kubernetes
```

Before running Jenkins pipeline, update:

```text
DOCKER_IMAGE = 'your-dockerhub-username/dailyops'
```

Also create Jenkins credential:

```text
dockerhub-creds
```

What to learn:

- Jenkins pipeline syntax
- credentials
- build number as image tag
- automated Helm deployment

## Phase 6: Prometheus and Grafana

Goal: monitor the Kubernetes app.

Install monitoring stack:

```powershell
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack
```

What to learn:

- Prometheus scraping
- pod metrics
- app metrics from `/metrics`
- Grafana dashboards

## Phase 7: Terraform and Cloud

Goal: move from local Minikube to AWS EKS.

Terraform will provision:

```text
ECR repository
EKS cluster
node group
IAM roles
networking
```

This should be done after you are comfortable with local Docker, Kubernetes, Helm, and Jenkins.

## Interview Explanation

Use this explanation:

```text
I built DailyOps, a Node.js productivity dashboard, and deployed it using a complete DevOps CI/CD workflow. Jenkins runs tests, builds a Docker image, pushes it to a registry, and deploys it to Kubernetes using Helm. Kubernetes uses health checks for reliability, and Prometheus/Grafana monitor application and cluster metrics.
```
