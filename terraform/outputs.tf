output "resource_group_name" {
  description = "Azure Resource Group containing DailyOps resources."
  value       = azurerm_resource_group.dailyops.name
}

output "acr_name" {
  description = "Globally unique Azure Container Registry name."
  value       = azurerm_container_registry.dailyops.name
}

output "acr_login_server" {
  description = "Azure Container Registry login server."
  value       = azurerm_container_registry.dailyops.login_server
}
