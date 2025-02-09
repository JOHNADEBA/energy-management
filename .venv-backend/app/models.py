from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    customer_type = Column(String)

    timeseries = relationship("TimeSeries", back_populates="customer")

class TimeSeries(Base):
    __tablename__ = "timeseries"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    timestamp = Column(DateTime)
    consumption_kWh = Column(Float, nullable=True)
    production_kWh = Column(Float, nullable=True)
    sipx_price = Column(Float)

    customer = relationship("Customer", back_populates="timeseries")
