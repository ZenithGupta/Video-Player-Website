# Worker Settings
workers = 2  # Hardcoded for 1GB RAM VM to prevent OOM
worker_class = 'gevent'
worker_connections = 100  # Reduced from 2000 to save memory per worker

# Server Settings
bind = "0.0.0.0:8000"

# Timeout Settings
timeout = 60  # Increased to prevent timeouts on slow CPU
graceful_timeout = 30