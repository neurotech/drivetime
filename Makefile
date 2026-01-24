.PHONY: start stop restart logs build clean

# Rainbow gradient colors (256-color palette)
define print_logo
	@printf '\033[38;5;196m ██████╗ ██████╗ ██╗██╗   ██╗███████╗████████╗██╗███╗   ███╗███████╗\033[0m\n'
	@printf '\033[38;5;208m ██╔══██╗██╔══██╗██║██║   ██║██╔════╝╚══██╔══╝██║████╗ ████║██╔════╝\033[0m\n'
	@printf '\033[38;5;220m ██║  ██║██████╔╝██║██║   ██║█████╗     ██║   ██║██╔████╔██║█████╗\033[0m\n'
	@printf '\033[38;5;47m ██║  ██║██╔══██╗██║╚██╗ ██╔╝██╔══╝     ██║   ██║██║╚██╔╝██║██╔══╝\033[0m\n'
	@printf '\033[38;5;39m ██████╔╝██║  ██║██║ ╚████╔╝ ███████╗   ██║   ██║██║ ╚═╝ ██║███████╗\033[0m\n'
	@printf '\033[38;5;171m ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚══════╝   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝\033[0m\n'
endef

# Start the application in detached mode
start:
	$(call print_logo)
	docker compose up -d

# Stop the application
stop:
	docker compose down

# Restart the application
restart:
	$(call print_logo)
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
