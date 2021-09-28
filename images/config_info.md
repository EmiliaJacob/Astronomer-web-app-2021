Damit sich die App lokal ausführen lässt wurde in den Images die IP Adresse des BW-Cloud Servers durch localhost ersetzt. 

# Befehle zu laden der Images 
- `docker load -i "asteroid-service" asteroid-service.tar`
- `docker load -i "frontend-and-userservice" frontend-and-userservice.tar`
- `docker load -i "mongo" mongo.tar`
- `docker load -i "nasa-integration-service" nasa-integration-service.tar`

# Befehl zum starten aller Container
- `docker compose up` 
