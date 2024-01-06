# Products API

This is a simple API to manage products.

## Prerequisites

Make sure you have the following installed:

- Node.js (version 20.x)
- pnpm (version 8.x)
- Docker (if using Docker Compose)

## Getting Started

1. Clone this repository

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set the environment variables
Create a .env file based on the provided .example.env file and adjust the values accordingly.

   ```bash
   cp .example.env .env
   ```

## Running the API

### Development

### Running with Docker Compose

1. Run the following command to start the database(s)

   ```bash
   pnpm dev:compose
    ```

2. Run the following to start the API

   ```bash
   pnpm start:dev
   ```

### Running without Docker Compose

1. Run the following to start the API

   ```bash
   pnpm start:dev
   ```

### Production (Docker Compose)

1. Run the following command to start

   ```bash
   pnpm prod:compose
    ```
