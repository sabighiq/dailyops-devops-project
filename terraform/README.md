# DailyOps Azure Infrastructure

This folder provisions the Azure infrastructure for DailyOps using Terraform.

## Phase 1

- Azure Resource Group
- Azure Container Registry using the Basic SKU

## Phase 2

- Azure Kubernetes Service using the Free control-plane tier
- AKS access to pull images from ACR

## Commands

```powershell
$env:TF_VAR_subscription_id = az account show --query id -o tsv
terraform init
terraform fmt -check
terraform validate
terraform plan -out dailyops.tfplan
```

`terraform plan` previews changes. It does not create resources.

Resource creation starts only after:

```powershell
terraform apply dailyops.tfplan
```

When the learning session is complete, remove billable resources with:

```powershell
terraform destroy
```
