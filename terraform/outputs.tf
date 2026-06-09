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

output "aks_name" {
  description = "Azure Kubernetes Service cluster name."
  value       = azurerm_kubernetes_cluster.dailyops.name
}

output "aks_node_resource_group" {
  description = "Azure-managed Resource Group containing AKS node resources."
  value       = azurerm_kubernetes_cluster.dailyops.node_resource_group
}

output "aks_get_credentials_command" {
  description = "Command used to merge AKS credentials into the local kubeconfig."
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.dailyops.name} --name ${azurerm_kubernetes_cluster.dailyops.name}"
}
