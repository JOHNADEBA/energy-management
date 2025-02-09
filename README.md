#### Energy Management App Documentation


## Overview

The Energy Management App is designed to help businesses and individuals monitor energy usage, manage customer data, and analyze time-series data for optimized energy consumption. It provides a RESTful API built with FastAPI and a frontend powered by Next.js, offering a modern and user-friendly interface for energy management.


## Features

- Customer Management: Add, update, and delete customer data.
- Time Series Analysis: Log and retrieve time-series data for customers.
- Cost Calculations: Perform cost calculations based on energy usage data.
- Scalable Architecture: Backend built using FastAPI and asynchronous SQLAlchemy for high performance.
- Frontend: React-based interface with Next.js for easy interaction.

## Logic

1. Customers are grouped into 3 categories(consumer, producer and both) which significantly influence how data is displayed or how crud actions are done.

  - If a customer is a consumer, 
    - only consumption_kWh can be used
    - On edit, you can only change type to both

  - If a customer is a producer, 
    - only production_kWh can be used
    - On edit, you can only change type to both

  - If a customer is a both, 
    - both production_kWh and consumption_kWh can be used
    - On edit, you can't change the type

  The logic for this is because data management will be easy. From the user type, you can easily assign rights.

2. When a customer accordion is clicked, it shows 2 tables, the first table displays different type of data depending on the customer type.

3. The sipx_price is a random function in the frontend than generates a float number which changes every hour. 


## Technology Stack

- Backend:
  - FastAPI (Python)
  - SQLAlchemy (with async support)
  - SQLite (can be replaced with other databases like PostgreSQL)

- Frontend:
  - Next.js (React)

- Containerization:
  - Docker for deployment

- Environment Management: Python-decouple for environment variables


## Project Structure
root/
|-- .venv-backend/
|   |-- app/
|   |   |-- __init__.py
|   |   |-- models.py     # SQLAlchemy models
|   |   |-- schemas.py    # Pydantic schemas
|   |   |-- crud.py       # Database operations
|   |   |-- utils.py      # Helper functions
|   |   |-- database.py   # Database connection setup
|   |-- app.py            # Main FastAPI application
|   |-- requirements.txt  # Backend dependencies
|   |-- .env              # Environment variables
|   |-- Dockerfile        # Docker setup for the backend
|   |-- energy_data.db    # DB

|-- frontend/
|   |-- app/
|   |   |-- components/   # React components
|   |   |-- hooks/        # React hooks
|   |   |-- pages/        # Next.js pages
|   |-- public/           # Static assets
|   |-- .env              # Environment variables
|   |-- Dockerfile        # Docker setup for the frontend
|-- docker-compose.yml    # Orchestrates the backend and frontend services
|-- README.md             # Documentation


## Prerequisites

- System Requirements:
  - Docker and Docker Compose installed.
  - Python 3.9+ (if running locally without Docker).
  - Node.js and npm/yarn (for frontend).

- Installations:
  - FastAPI dependencies (see requirements.txt).
  - Next.js dependencies (package.json in the frontend folder).


## Setup Instructions

1. Clone the Repository and cd energy-mang

2. Configure Environment Variables
  -Create a .env file in the .venv-backend directory with the following variables:
  - DATABASE_URL=sqlite+aiosqlite:///app/energy_data.db
  - FRONTEND_URL=http://localhost:3000

3. Install Dependencies
   - Backend: 
     If running locally:
     - cd backend
     - pip install -r requirements.txt

     - Frontend: 
       If running locally:
       - cd frontend
       - npm install


## Running the App

1. Run with Docker
   - Build and Start Containers: 
     - In the terminal, navigate to \energy-mang
     - Run docker-compose up --build

2. Run Locally (Without Docker)

    - Backend:
     - cd backend
     - .venv-backend\Scripts\Activate.ps1
     - pip install -r requirements.txt 
     - uvicorn main:app --reload

   - Frontend:
     - cd frontend
     - npm run dev


## Access the App:

- Backend (FastAPI): http://localhost:8000/docs
- Frontend (Next.js): http://localhost:3000



