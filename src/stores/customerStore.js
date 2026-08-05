import { create } from "zustand";
import axios from "axios";
import { transformCustomer } from "../utils/transformCustomer";

export const useCustomerStore = create((set) => ({
  customers: [],
  loading: false,


  fetchCustomers: async () => {
    set({ loading: true });

    const res = await axios.get("/api/customers");

    const transformed = res.data.map(transformCustomer);

    set({ customers: transformed, loading: false });
  },


}));