import React, { useEffect } from "react";
import {
  AddCustomerFormProps,
  AddNewTimeSeries,
  CustomerType,
  ErrorResponse,
} from "../types";
import { useForm } from "../hooks/useForm";
import { useSIPXPrice } from "../hooks/useSIPXPrice";
import { useErrorHandling } from "../hooks/useErrorHandling";
import { apiService } from "../services/apiService";
import { capitalize } from "../utils/utils";
import ErrorDisplay from "./ErrorDisplay";
import SuccessMessage from "./SuccessMessage";

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  onAddCustomer,
  editCustomer,
}) => {
  const {
    firstName,
    lastName,
    customerType,
    timestamp,
    consumptionKWh,
    productionKWh,
    success,
    setFirstName,
    setLastName,
    setCustomerType,
    setTimestamp,
    setConsumptionKWh,
    setProductionKWh,
    setSuccess,
    handleClearForm,
  } = useForm();

  const sipxPrice = useSIPXPrice();
  const { error, setError, handleError } = useErrorHandling();
  const formattedCustomerType =
    editCustomer?.customer_type?.toLowerCase() || "customer";

  // If we're in edit mode, populate the form with the existing customer data
  useEffect(() => {
    if (editCustomer) {
      setFirstName(editCustomer.first_name);
      setLastName(editCustomer.last_name);
      setCustomerType(formattedCustomerType);
    }
  }, [editCustomer]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const newCustomer = {
        first_name: firstName,
        last_name: lastName,
        customer_type: customerType,
      };

      let customerResponse;
      if (editCustomer) {
        customerResponse = await apiService.updateCustomer(
          editCustomer.id,
          newCustomer
        );
        setSuccess("Customer successfully updated!");
      } else {
        customerResponse = await apiService.addCustomer(newCustomer);
        const customerId = customerResponse.id;

        // Insert the time series data
        const newTimeSeriesInsertData: AddNewTimeSeries = {
          customer_id: customerId,
          timestamp,
          consumption_kWh: consumptionKWh,
          production_kWh: productionKWh,
          sipx_price: sipxPrice,
        };

        await apiService.addTimeSeries(newTimeSeriesInsertData);
        setSuccess("Customer successfully added!");
      }

      // Trigger update in the parent component (either added or updated)
      onAddCustomer();
      handleCancel();
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

  const handleCancel = (): void => {
    handleClearForm(editCustomer ? true : false, editCustomer);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        {success && <SuccessMessage message={success} />}

        {error && <ErrorDisplay error={error} />}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              className="mt-1 block w-full rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              className="mt-1 block w-full rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Customer Type <span className="text-red-500">*</span>
            </label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none p-2"
              required
              disabled={formattedCustomerType === CustomerType.BOTH}
            >
              {formattedCustomerType === CustomerType.CONSUMER ? (
                <>
                  <option value={CustomerType.BOTH}>
                    {capitalize(CustomerType.BOTH)}
                  </option>
                  <option value={CustomerType.CONSUMER}>
                    {capitalize(CustomerType.CONSUMER)}
                  </option>
                </>
              ) : formattedCustomerType === CustomerType.PRODUCER ? (
                <>
                  <option value={CustomerType.BOTH}>
                    {capitalize(CustomerType.BOTH)}
                  </option>
                  <option value={CustomerType.PRODUCER}>
                    {capitalize(CustomerType.PRODUCER)}
                  </option>
                </>
              ) : (
                Object.values(CustomerType).map((type, index) => (
                  <option key={`${type}-${index}`} value={type}>
                    {capitalize(type)}
                  </option>
                ))
              )}
            </select>
          </div>
          {/* Show these fields only if we're not editing */}
          {!editCustomer && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Timestamp <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none p-2"
                  required
                />
              </div>

              {(customerType === "consumer" || customerType === "both") && (
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Consumption (kWh) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={consumptionKWh || ""}
                    onChange={(e) =>
                      setConsumptionKWh(parseFloat(e.target.value))
                    }
                    placeholder="Enter consumption"
                    className="mt-1 block w-full rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none p-2"
                    required={
                      customerType === "consumer" || customerType === "both"
                    }
                  />
                </div>
              )}

              {(customerType === "producer" || customerType === "both") && (
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Production (kWh) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={productionKWh || ""}
                    onChange={(e) =>
                      setProductionKWh(parseFloat(e.target.value))
                    }
                    placeholder="Enter production"
                    className="mt-1 block w-full rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none p-2"
                    required={
                      customerType === "producer" || customerType === "both"
                    }
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  SIPX Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={sipxPrice}
                  readOnly
                  className="mt-1 block w-full rounded-lg border border-gray-300 text-gray-500 shadow-sm focus:outline-none p-2 bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {editCustomer ? "Update Customer" : "Add Customer"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-6 py-3 bg-gray-300 text-gray-800 font-semibold text-sm rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomerForm;
