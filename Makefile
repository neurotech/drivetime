.PHONY: start stop restart logs build clean

# Start the application in detached mode
start:
	docker compose up -d

# Stop the application
stop:
	docker compose down

# Restart the application
restart:
	docker compose down
	docker compose up -d

# View logs (follow mode)
logs:
	docker compose logs -f

# Build/rebuild the image
build:
	docker compose build

# Stop and remove volumes (clean slate)
clean:
	docker compose down -v
