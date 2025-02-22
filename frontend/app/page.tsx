"use client";

import React, { useState } from "react";
import CustomerAccordion from "./components/CustomerAccordion";
import AddCustomerForm from "./components/AddCustomerForm";
import { Customer } from "./types";
import { useCustomers } from "./hooks/useCustomers";

const Home: React.FC = () => {
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Using the custom hook for customer data management
  const {
    filteredCustomers,
    selectedCustomerData,
    searchQuery,
    setSearchQuery,
    setSelectedCustomerData,
    handleDeleteCustomer,
    fetchCustomers,
  } = useCustomers();

  // Resetting edit customer when form visibility changes
  React.useEffect(() => {
    if (!showForm) {
      setEditCustomer(null);
    }
  }, [showForm]);

  const handleAddCustomer = () => {
    // Refresh customer list after adding
    fetchCustomers();
    setTimeout(() => setShowForm(false), 3000);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditCustomer(customer);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Energy Management Dashboard</h1>

      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm
          ? "Hide Form"
          : editCustomer
          ? "Edit Customer"
          : "Add Customer"}
      </button>

      {showForm && (
        <AddCustomerForm
          onAddCustomer={handleAddCustomer}
          editCustomer={editCustomer}
          setEditCustomer={setEditCustomer}
        />
      )}

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search customers..."
        className="my-12 px-4 py-2 border rounded w-full text-black focus:outline-none focus:ring-0"
      />

      {filteredCustomers.length === 0 ? (
        <p className="text-gray-500">
          {searchQuery
            ? "No matching customers found."
            : "No customers available."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCustomers.map((customer, index) => (
            <CustomerAccordion
              key={customer.id + index}
              customer={customer}
              selectedCustomerData={selectedCustomerData}
              setSelectedCustomerData={setSelectedCustomerData}
              onDelete={handleDeleteCustomer}
              onEdit={handleEditCustomer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
