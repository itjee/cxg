/**
 * FixedAssets Service
 * API를 통한 고정자산 데이터 관리
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100';
const API_ENDPOINT = `${API_BASE_URL}/api/fam/fixed-assets`;

export const fixedAssetsService = {
  async list(params?: any): Promise<any> {
    try {
      const response = await axios.get(API_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async get(id: string): Promise<any> {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${id}:`, error);
      throw error;
    }
  },

  async create(data: any): Promise<any> {
    try {
      const response = await axios.post(API_ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating:', error);
      throw error;
    }
  },

  async update(id: string, data: any): Promise<any> {
    try {
      const response = await axios.patch(`${API_ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting ${id}:`, error);
      throw error;
    }
  },
};
