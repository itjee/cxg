import axios from 'axios';
import type { SalesordersList, CreateSalesordersRequest } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100';
const API_ENDPOINT = `${API_BASE_URL}/api/srm/sales-orders`;

export const service = {
  async list(params?: any) {
    return axios.get(API_ENDPOINT, { params });
  },
  async get(id: string) {
    return axios.get(`${API_ENDPOINT}/${id}`);
  },
  async create(data: any) {
    return axios.post(API_ENDPOINT, data);
  },
  async update(id: string, data: any) {
    return axios.patch(`${API_ENDPOINT}/${id}`, data);
  },
  async delete(id: string) {
    return axios.delete(`${API_ENDPOINT}/${id}`);
  },
};
