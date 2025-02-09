from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from decouple import config
from typing import List, AsyncGenerator
from app import models, schemas, crud, utils
from app.database import SessionLocal, init_db

app = FastAPI()

# Enable CORS
origins = [
    config("FRONTEND_URL"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the database
@app.on_event("startup")
async def on_startup():
    await init_db()

# Exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

# Dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

@app.post("/customers/", response_model=schemas.Customer)
async def create_customer(customer: schemas.CustomerCreate, db: AsyncSession = Depends(get_db)) -> schemas.Customer:
    return await crud.create_customer(db=db, customer=customer)

@app.get("/customers/", response_model=List[schemas.Customer])
async def read_customers(db: AsyncSession = Depends(get_db)) -> List[schemas.Customer]:
    customers = await crud.get_customers(db)
    return customers

@app.patch("/customers/{customer_id}", response_model=schemas.Customer)
async def update_customer(customer_id: int, customer: schemas.CustomerCreate, db: AsyncSession = Depends(get_db)) -> schemas.Customer:
    updated_customer = await crud.update_customer(db=db, customer_id=customer_id, customer=customer)
    if updated_customer:
        return updated_customer
    raise HTTPException(status_code=404, detail="Customer not found")

@app.delete("/customers/{customer_id}", response_model=dict)
async def delete_customer(customer_id: int, db: AsyncSession = Depends(get_db)) -> dict:
    # Get the customer details
    customer = await db.get(models.Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Delete the customer
    await db.delete(customer)
    await db.commit()
    return {"message": "Customer deleted successfully"}

@app.post("/timeseries/", response_model=schemas.TimeSeries)
async def create_timeseries(timeseries: schemas.TimeSeriesCreate, db: AsyncSession = Depends(get_db)) -> schemas.TimeSeries:
    await utils.validate_timeseries(timeseries, db)
    return await crud.create_timeseries(db=db, timeseries=timeseries)

@app.get("/timeseries/{customer_id}", response_model=List[schemas.TimeSeries])
async def read_timeseries(customer_id: int, db: AsyncSession = Depends(get_db)) -> List[schemas.TimeSeries]:
    return await crud.get_timeseries(db=db, customer_id=customer_id)

@app.get("/calculations/{customer_id}")
async def calculate_costs(customer_id: int, db: AsyncSession = Depends(get_db)) -> dict:
    return await utils.calculate_costs(customer_id, db)
