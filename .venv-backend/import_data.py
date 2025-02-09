import csv
import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, database

async def import_data():
    async with AsyncSession(database.engine) as session:
        async with session.begin():
            with open('20240101_20241231_historical_cons_prod_and_prices.csv', 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    timestamp = datetime.strptime(row['timestamp'], '%Y-%m-%d %H:%M:%S')
                    sipx_price = float(row['SIPX_EUR_kWh'])

                    for key, value in row.items():
                        if 'customer' in key and '_cons_kWh' in key:
                            customer_id = int(key.replace('customer', '').replace('_cons_kWh', ''))
                            consumption_kWh = float(value)
                            # Ensure customer exists or create
                            customer = await session.get(models.Customer, customer_id)
                            if not customer:
                                customer = models.Customer(id=customer_id, name=f'Customer {customer_id}', customer_type='consumer')
                                session.add(customer)
                            # Insert time series data
                            timeseries = models.TimeSeries(
                                customer_id=customer_id,
                                timestamp=timestamp,
                                consumption_kWh=consumption_kWh,
                                sipx_price=sipx_price
                            )
                            session.add(timeseries)
                    await session.commit()

if __name__ == "__main__":
    asyncio.run(import_data())
