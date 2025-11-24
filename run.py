import os
from mesa_abm.server import server

# Render assigns a dynamic port through the PORT environment variable
port = int(os.environ.get("PORT", 8522))

server.port = port
server.launch()
