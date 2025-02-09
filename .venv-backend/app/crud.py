from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from . import models, schemas

async def get_customers(db: AsyncSession) -> List[models.Customer]:
    result = await db.execute(select(models.Customer))
    return result.scalars().all()

async def create_customer(db: AsyncSession, customer: schemas.CustomerCreate) -> models.Customer:
    db_customer = models.Customer(
        first_name=customer.first_name,
        last_name=customer.last_name,
        customer_type=customer.customer_type.value
    )
    db.add(db_customer)
    await db.commit()
    await db.refresh(db_customer)
    return db_customer

async def update_customer(db: AsyncSession, customer_id: int, customer: schemas.CustomerCreate) -> models.Customer:
    db_customer = await db.get(models.Customer, customer_id)
    if db_customer:
        db_customer.first_name = customer.first_name
        db_customer.last_name = customer.last_name
        db_customer.customer_type = customer.customer_type.value  # Ensure it's saved as a valid enum value
        db.add(db_customer)
        await db.commit()
        await db.refresh(db_customer)
        return db_customer
    return None

async def get_timeseries(db: AsyncSession, customer_id: int) -> List[models.TimeSeries]:
    result = await db.execute(select(models.TimeSeries).filter(models.TimeSeries.customer_id == customer_id))
    return result.scalars().all()

async def create_timeseries(db: AsyncSession, timeseries: schemas.TimeSeriesCreate) -> models.TimeSeries:
    db_timeseries = models.TimeSeries(**timeseries.dict())
    db.add(db_timeseries)
    await db.commit()
    await db.refresh(db_timeseries)
    return db_timeseries
