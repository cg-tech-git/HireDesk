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

# Database schema setup
db-init:
	cd scripts && psql -h localhost -U postgres -d hiredesk -f init-db.sql

db-pricing-schema:
	cd scripts && psql -h localhost -U postgres -d hiredesk -f pricing-schema.sql

db-setup: db-init db-pricing-schema
	@echo "✅ Database schema setup completed"

# Pricing data import
pricing-import:
	@echo "Usage: make pricing-import CSV_FILE=path/to/file.csv"
	@if [ -z "$(CSV_FILE)" ]; then \
		echo "❌ Error: CSV_FILE parameter is required"; \
		echo "Example: make pricing-import CSV_FILE=pricing_data/HireDesk_Master_Pricing.csv"; \
		exit 1; \
	fi
	cd scripts && npm install && npx ts-node import-pricing.ts "../$(CSV_FILE)"

# Complete setup with pricing import
setup-with-pricing:
	@echo "Usage: make setup-with-pricing CSV_FILE=path/to/file.csv"
	@if [ -z "$(CSV_FILE)" ]; then \
		echo "❌ Error: CSV_FILE parameter is required"; \
		echo "Example: make setup-with-pricing CSV_FILE='pricing_data/HireDesk_Master_Pricing - Sheet1.csv'"; \
		exit 1; \
	fi
	cd scripts && ./setup-and-import.sh "../$(CSV_FILE)"

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
	@echo "  make db-setup   - Initialize database schema"
	@echo "  make pricing-import CSV_FILE=path - Import pricing data from CSV"
	@echo "  make setup-with-pricing CSV_FILE=path - Complete setup with pricing"
	@echo "  make lint       - Run linters"
	@echo "  make format     - Format code" 