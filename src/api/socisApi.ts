import axios from "axios";
import type { Soci } from "../types";

const API = import.meta.env.VITE_API_URL;

export const getSocis = async (): Promise<Soci[]> => {
  const res = await axios.get(`${API}/socis`);
  return res.data;
};

export const addSoci = async (data: Partial<Soci>): Promise<Soci> => {
  const res = await axios.post(`${API}/socis`, data);
  return res.data;
};
