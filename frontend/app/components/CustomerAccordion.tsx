import React, { useState } from "react";
import Image from "next/image";
import { CustomerProps, CustomerTableData, ErrorResponse } from "../types";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { apiService } from "../services/apiService";
import { formatDate } from "../utils/utils";

const CustomerAccordion: React.FC<CustomerProps> = ({
  customer,
  selectedCustomerData,
  setSelectedCustomerData,
  onDelete,
  onEdit,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { handleError } = useErrorHandling();

  const handleCustomerClick = async (customerId: number): Promise<void> => {
    setOpen(!open);
    if (!selectedCustomerData[customerId] && !open) {
      try {
        const data = await apiService.fetchCustomerData(customerId);
        setSelectedCustomerData((prevData) => ({
          ...prevData,
          [customerId]: data,
        }));
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
    }
  };

  return (
    <div key={customer.id}>
      <button
        className="flex justify-between w-full px-4 py-2 text-left text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
        onClick={() => handleCustomerClick(customer.id)}
      >
        <span>
          {customer.first_name} {customer.last_name} ({customer.customer_type})
        </span>
        <div className="flex items-center space-x-2">
          <Image
            src={open ? "/chevron-down.svg" : "/chevron-up.svg"}
            alt={open ? "Chevron Down" : "Chevron Up"}
            width={20}
            height={20}
          />

          <div
            className="text-red-500 hover:text-red-700 focus:outline-none cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(customer.id);
            }}
          >
            <Image src="/delete.svg" alt="Delete" width={20} height={20} />
          </div>
          <div
            className="text-blue-500 hover:text-blue-700 focus:outline-none cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(customer);
            }}
          >
            <Image src="/edit.svg" alt="Edit" width={18} height={18} />
          </div>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
          open ? "max-h-screen" : "max-h-0"
        }`}
      >
        {open && selectedCustomerData[customer.id] && (
          <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
            <table className="table-auto w-full mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2">Metric</th>
                  <th className="px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomerData[customer.id]?.total_cost !==
                  undefined && (
                  <tr>
                    <td className="border px-4 py-2">Total Cost</td>
                    <td className="border px-4 py-2">
                      €{selectedCustomerData[customer.id]?.total_cost}
                    </td>
                  </tr>
                )}
                {selectedCustomerData[customer.id]?.total_revenue !==
                  undefined && (
                  <tr>
                    <td className="border px-4 py-2">Total Revenue</td>
                    <td className="border px-4 py-2">
                      €{selectedCustomerData[customer.id]?.total_revenue}
                    </td>
                  </tr>
                )}
                {selectedCustomerData[customer.id]?.net !== undefined && (
                  <tr>
                    <td className="border px-4 py-2">Net</td>
                    <td className="border px-4 py-2">
                      €{selectedCustomerData[customer.id]?.net}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Timestamp</th>
                  <th className="px-4 py-2">Consumption (kWh)</th>
                  <th className="px-4 py-2">Production (kWh)</th>
                  <th className="px-4 py-2">Sipx Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomerData[customer.id]?.rows?.map(
                  (row: CustomerTableData, index: number) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        {formatDate(row.timestamp)}
                      </td>
                      <td className="border px-4 py-2">
                        {row.consumption_kWh}
                      </td>
                      <td className="border px-4 py-2">{row.production_kWh}</td>
                      <td className="border px-4 py-2">€{row.sipx_price}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAccordion;
