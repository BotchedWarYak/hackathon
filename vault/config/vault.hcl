# HashiCorp Vault Configuration for Production
# This configuration is for production use with proper security settings

# Storage backend - In production, use cloud storage (Azure Key Vault, AWS KMS, etc.)
storage "file" {
  path = "/vault/data"
}

# Listener for API requests
listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1  # Set to 0 in production with proper TLS certificates
}

# API address for client communication
api_addr = "http://0.0.0.0:8200"

# UI settings
ui = true

# Disable mlock (only for development/containers)
disable_mlock = true

# Log level
log_level = "INFO"

# Default lease settings
default_lease_ttl = "168h"  # 1 week
max_lease_ttl = "720h"      # 30 days

# Plugin directory
plugin_directory = "/vault/plugins"

# Telemetry (optional)
telemetry {
  disable_hostname = true
}