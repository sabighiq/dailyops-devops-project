locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
    purpose     = "devops-learning"
  }
}

resource "random_string" "acr_suffix" {
  length  = 6
  upper   = false
  special = false
}

resource "azurerm_resource_group" "dailyops" {
  name     = "rg-${local.name_prefix}"
  location = var.location
  tags     = local.common_tags
}

resource "azurerm_container_registry" "dailyops" {
  name                = "${var.project_name}${var.environment}${random_string.acr_suffix.result}"
  resource_group_name = azurerm_resource_group.dailyops.name
  location            = azurerm_resource_group.dailyops.location
  sku                 = "Basic"
  admin_enabled       = false
  tags                = local.common_tags
}

resource "azurerm_kubernetes_cluster" "dailyops" {
  name                = "aks-${local.name_prefix}"
  location            = azurerm_resource_group.dailyops.location
  resource_group_name = azurerm_resource_group.dailyops.name
  dns_prefix          = "aks-${local.name_prefix}"
  sku_tier            = "Free"

  default_node_pool {
    name            = "system"
    node_count      = var.aks_node_count
    vm_size         = var.aks_node_vm_size
    os_disk_size_gb = 64
    type            = "VirtualMachineScaleSets"
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    network_policy    = "azure"
    load_balancer_sku = "standard"
  }

  role_based_access_control_enabled = true
  local_account_disabled            = false

  tags = local.common_tags
}

resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = azurerm_container_registry.dailyops.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.dailyops.kubelet_identity[0].object_id
}
