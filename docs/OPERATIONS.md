# DailyOps Operations Guide

## Start a New Session

```powershell
cd "C:\Users\iquya\Documents\Codex\2026-06-05\developer-git-repository-github-gitlab-bitbucket\work\dailyops"

az account show --output table
az aks start --resource-group rg-dailyops-learning --name aks-dailyops-learning
az aks get-credentials --resource-group rg-dailyops-learning --name aks-dailyops-learning --overwrite-existing
kubectl get nodes
kubectl get pods
```

Jenkins:

```powershell
Get-Service Jenkins
```

If stopped, use Administrator PowerShell:

```powershell
Start-Service Jenkins
```

## End a Session

Stop AKS node compute when it is not needed:

```powershell
az aks stop --resource-group rg-dailyops-learning --name aks-dailyops-learning
```

Confirm:

```powershell
az aks show `
  --resource-group rg-dailyops-learning `
  --name aks-dailyops-learning `
  --query powerState.code -o tsv
```

Stopping AKS does not delete ACR, public IPs, disks, or Terraform state.

## Public Application

```powershell
kubectl get service dailyops
```

Open:

```text
http://<external-ip>
http://<external-ip>/health
http://<external-ip>/metrics
```

## Grafana

```powershell
kubectl port-forward -n monitoring service/monitoring-grafana 3007:80
```

Retrieve the generated password:

```powershell
kubectl get secret -n monitoring monitoring-grafana `
  -o jsonpath="{.data.admin-password}" |
ForEach-Object {
  [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_))
}
```

Username:

```text
admin
```

## Troubleshooting

```powershell
kubectl get pods -A
kubectl describe pod <pod-name>
kubectl logs deployment/dailyops
kubectl rollout status deployment/dailyops
helm history dailyops
```

Current image:

```powershell
kubectl get deployment dailyops `
  -o jsonpath="{.spec.template.spec.containers[0].image}"
```

## Full Cleanup

This permanently deletes Terraform-managed Azure resources:

```powershell
cd terraform
$env:TF_VAR_subscription_id = az account show --query id -o tsv
terraform destroy
```

Review the destroy plan carefully and type `yes` only when the project is no longer needed.
