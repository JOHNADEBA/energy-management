import { useState, useEffect } from "react";
import { Customer, CustomerData, ErrorResponse } from "../types";
import { apiService } from "../services/apiService";
import { capitalize } from "../utils/utils";
import { useErrorHandling } from "./useErrorHandling";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomerData, setSelectedCustomerData] = useState<{
    [key: number]: CustomerData | null;
  }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { handleError } = useErrorHandling();

  useEffect(() => {
    fetchCustomers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setFilteredCustomers(
      searchQuery
        ? customers.filter((customer) =>
            [customer.first_name, customer.last_name, customer.customer_type]
              .map((str) => str.toLowerCase())
              .some((str) => str.includes(searchQuery.toLowerCase()))
          )
        : customers
    );
  }, [searchQuery, customers]);

  const fetchCustomers = async () => {
    try {
      const data = await apiService.fetchCustomers();
      setCustomers(
        data.map((customer: Customer) => ({
          ...customer,
          first_name: capitalize(customer.first_name),
          last_name: capitalize(customer.last_name),
          customer_type: capitalize(customer.customer_type),
        }))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleError(error as { response?: ErrorResponse });
      } else {
        handleError(
          new Error("An unexpected error occurred.") as {
            response?: ErrorResponse;
          }
        );
      }
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await apiService.deleteCustomer(customerId);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      setSelectedCustomerData((prev) => {
        const newData = { ...prev };
        delete newData[customerId];
        return newData;
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleError(error as { response?: ErrorResponse });
      } else {
        handleError(
          new Error("An unexpected error occurred.") as {
            response?: ErrorResponse;
          }
        );
      }
    }
  };

  return {
    customers,
    filteredCustomers,
    selectedCustomerData,
    searchQuery,
    setSearchQuery,
    setSelectedCustomerData,
    handleDeleteCustomer,
    fetchCustomers,
  };
};
