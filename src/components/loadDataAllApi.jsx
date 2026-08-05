import { useEffect } from "react";
import { useCustomerStore } from "../stores/customerStore";

export default function CustomersPage() {
  const customers = useCustomerStore((state) => state.customers);
  const loading = useCustomerStore((state) => state.loading);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  useEffect(() => {
    fetchCustomers(); 
  }, []);

  return (
    <div>
      {loading && <p>جاري التحميل...</p>}

      {customers.map((c) => (
        <div key={c.id}>{c.label}</div>
      ))}
    </div>
  );
}