export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  customer_type: string;
}

export interface CustomerData {
  total_cost?: number;
  total_revenue?: number;
  net?: number;
  rows?: CustomerTableData[];
}

export interface CustomerTableData {
  id: number;
  timestamp: string;
  consumption_kWh: number;
  production_kWh: number;
  sipx_price: number;
  customer_id: number;
}

export interface CustomerProps {
  customer: Customer;
  selectedCustomerData: { [key: number]: CustomerData | null };
  setSelectedCustomerData: React.Dispatch<
    React.SetStateAction<{ [key: number]: CustomerData | null }>
  >;
  onDelete: (customerId: number) => void;
  onEdit: (customer: Customer) => void;
}

export interface AddCustomerFormProps {
  onAddCustomer: () => void;
  editCustomer: Customer | null;
  setEditCustomer: (customer: Customer | null) => void;
}

export enum CustomerType {
  CONSUMER = "consumer",
  PRODUCER = "producer",
  BOTH = "both",
}

export interface AddNewTimeSeries {
  customer_id: number;
  timestamp: string;
  consumption_kWh: number | undefined;
  production_kWh: number | undefined;
  sipx_price: number;
}

export interface ErrorDetail {
  loc: string[];
  msg: string;
  message?: string;
}

export interface ErrorResponse {
  data: {
    detail: ErrorDetail[] | string;
  };
}
