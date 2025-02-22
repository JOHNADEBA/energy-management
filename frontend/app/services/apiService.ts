import axios from "axios";
import { AddNewTimeSeries, Customer, CustomerData } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiService = {
  fetchCustomers: async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_BASE_URL}/customers/`);
    return response.data;
  },

  fetchCustomerData: async (customerId: number): Promise<CustomerData> => {
    const response = await axios.get(
      `${API_BASE_URL}/calculations/${customerId}`
    );
    return response.data;
  },

  addCustomer: async (customer: Partial<Customer>): Promise<Customer> => {
    const response = await axios.post(`${API_BASE_URL}/customers/`, customer);
    return response.data;
  },

  updateCustomer: async (
    customerId: number,
    customer: Partial<Customer>
  ): Promise<Customer> => {
    const response = await axios.patch(
      `${API_BASE_URL}/customers/${customerId}`,
      customer
    );
    return response.data;
  },

  deleteCustomer: async (customerId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/customers/${customerId}`);
  },

  addTimeSeries: async (timeSeries: AddNewTimeSeries) => {
    await axios.post(`${API_BASE_URL}/timeseries/`, timeSeries);
  },
};
