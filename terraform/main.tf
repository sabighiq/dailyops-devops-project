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
