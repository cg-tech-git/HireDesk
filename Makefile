.PHONY: install dev build test clean docker-up docker-down setup

# Install all dependencies
install:
	npm install

# Run development servers
dev:
	npm run dev

# Build all packages
build:
	npm run build

# Run tests
test:
	npm test

# Clean all build artifacts and node_modules
clean:
	rm -rf node_modules packages/*/node_modules
	rm -rf packages/*/dist packages/frontend/.next
	rm -rf packages/*/tsconfig.tsbuildinfo

# Start Docker services
docker-up:
	docker-compose up -d

# Stop Docker services
docker-down:
	docker-compose down

# Initial project setup
setup: docker-up install
	@echo "Creating .env.local from env.example..."
	@cp env.example .env.local
	@echo "Setup complete! Edit .env.local with your configuration."
	@echo "Run 'make dev' to start the development servers."

# Database operations
db-migrate:
	cd packages/backend && npm run migration:run

db-seed:
	cd packages/backend && npm run seed

# Linting and formatting
lint:
	npm run lint

format:
	npm run format

# Help command
help:
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Run development servers"
	@echo "  make build      - Build all packages"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make docker-up  - Start Docker services"
	@echo "  make docker-down - Stop Docker services"
	@echo "  make setup      - Initial project setup"
	@echo "  make lint       - Run linters"
	@echo "  make format     - Format code" 