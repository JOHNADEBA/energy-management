import { useState } from "react";
import { Customer, CustomerType } from "../types";

export const useForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [customerType, setCustomerType] = useState("consumer");
  const [timestamp, setTimestamp] = useState("");
  const [consumptionKWh, setConsumptionKWh] = useState<number | undefined>(0.0);
  const [productionKWh, setProductionKWh] = useState<number | undefined>(0.0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClearForm = (
    isEditCustomer: boolean = false,
    data: Customer | null
  ) => {
    setFirstName(isEditCustomer && data ? data.first_name : "");
    setLastName(isEditCustomer && data ? data.last_name : "");
    setCustomerType(
      isEditCustomer && data
        ? CustomerType[
            data.customer_type.toUpperCase() as keyof typeof CustomerType
          ]
        : ""
    );
    setTimestamp("");
    setConsumptionKWh(0.0);
    setProductionKWh(0.0);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  return {
    firstName,
    lastName,
    customerType,
    timestamp,
    consumptionKWh,
    productionKWh,
    error,
    success,
    setFirstName,
    setLastName,
    setCustomerType,
    setTimestamp,
    setConsumptionKWh,
    setProductionKWh,
    setError,
    setSuccess,
    handleClearForm,
  };
};
