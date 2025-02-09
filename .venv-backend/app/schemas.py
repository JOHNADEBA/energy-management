from pydantic import BaseModel, constr, validator, ValidationError
from datetime import datetime
from typing import Optional
from enum import Enum

class AcceptedCustomerTypes(str, Enum):
    CONSUMER = 'consumer'
    PRODUCER = 'producer'
    BOTH = 'both'

class CustomerBase(BaseModel):
    first_name: constr(min_length=2)
    last_name: constr(min_length=2)
    customer_type: AcceptedCustomerTypes

    @validator('customer_type', pre=True)
    def convert_customer_type_to_lower(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v

    @classmethod
    def validate(cls, value):
        try:
            return super().validate(value)
        except ValidationError as e:
            raise ValueError(str(e))

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int

    class Config:
        orm_mode = True

class TimeSeriesBase(BaseModel):
    customer_id: int
    timestamp: datetime
    consumption_kWh: Optional[float] = 0.0
    production_kWh: Optional[float] = 0.0
    sipx_price: float

class TimeSeriesCreate(TimeSeriesBase):
    pass

class TimeSeries(TimeSeriesBase):
    id: int

    class Config:
        orm_mode = True
