from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models
from app.schemas import AcceptedCustomerTypes

async def validate_timeseries(timeseries, db: AsyncSession):
    # Get the customer details
    customer = await db.get(models.Customer, timeseries.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Validate time series data based on customer type
    if customer.customer_type == AcceptedCustomerTypes.CONSUMER.value and timeseries.production_kWh != 0.0:
        raise HTTPException(status_code=400, detail="Consumers cannot have production_kWh, change customer type to both.")
    elif customer.customer_type == AcceptedCustomerTypes.PRODUCER.value and timeseries.consumption_kWh != 0.0:
        raise HTTPException(status_code=400, detail="Producers cannot have consumption_kWh, change customer type to both.")

async def calculate_costs(customer_id: int, db: AsyncSession) -> dict:
    # Get the customer details
    customer = await db.get(models.Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Get the time series data
    result = await db.execute(select(models.TimeSeries).filter(models.TimeSeries.customer_id == customer_id))
    rows = result.scalars().all()

    total_cost = 0.0
    total_revenue = 0.0
    serialized_rows = []

    for row in rows:
        consumption = row.consumption_kWh or 0.0
        production = row.production_kWh or 0.0
        price = row.sipx_price
        total_cost += consumption * price
        total_revenue += production * price

        # Convert the row to a dictionary (make sure your model supports this or define a custom serializer)
        serialized_rows.append({
            "id": row.id,
            "timestamp": row.timestamp.isoformat(),  # Convert datetime to ISO format
            "consumption_kWh": row.consumption_kWh,
            "production_kWh": row.production_kWh,
            "sipx_price": row.sipx_price,
            "customer_id": row.customer_id,
        })

    # Calculate based on customer type using the AcceptedCustomerTypes enum
    if customer.customer_type == AcceptedCustomerTypes.CONSUMER.value:
        return {
            "customer_id": customer_id,
            "total_cost": round(total_cost, 2),
            "rows":serialized_rows
        }
    elif customer.customer_type == AcceptedCustomerTypes.PRODUCER.value:
        return {
            "customer_id": customer_id,
            "total_revenue": round(total_revenue, 2),
            "rows":serialized_rows
        }
    elif customer.customer_type == AcceptedCustomerTypes.BOTH.value:
        return {
            "customer_id": customer_id,
            "total_cost": round(total_cost, 2),
            "total_revenue": round(total_revenue, 2),
            "net": round(total_revenue - total_cost, 2),
            "rows":serialized_rows
        }
