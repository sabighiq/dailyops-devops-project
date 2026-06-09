variable "subscription_id" {
  description = "Azure subscription ID used by the AzureRM provider."
  type        = string
  sensitive   = true
}

variable "location" {
  description = "Azure region for DailyOps resources."
  type        = string
  default     = "centralindia"
}

variable "project_name" {
  description = "Short project name used in Azure resource names."
  type        = string
  default     = "dailyops"
}

variable "environment" {
  description = "Environment name used in resource names and tags."
  type        = string
  default     = "learning"
}

variable "aks_node_vm_size" {
  description = "Azure VM size for the single AKS learning node."
  type        = string
  default     = "Standard_D4s_v5"
}

variable "aks_node_count" {
  description = "Number of nodes in the AKS system node pool."
  type        = number
  default     = 1

  validation {
    condition     = var.aks_node_count >= 1
    error_message = "AKS requires at least one system node."
  }
}
