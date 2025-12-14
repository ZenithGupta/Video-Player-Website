# Worker Settings
import multiprocessing

workers = 2 * multiprocessing.cpu_count() + 1  # Dynamically determine the optimal workers

worker_class = 'gevent' 
worker_connections = 2000 

# Server Settings
bind = "0.0.0.0:8000" 

# Timeout Settings
timeout = 30  # Automatically restart workers if they take too long
graceful_timeout = 30  # Graceful shutdown for workers