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
