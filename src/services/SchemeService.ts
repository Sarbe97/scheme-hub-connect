
import api from "./api-client";
import { Scheme } from "./dto-types";

export class SchemeService {
  static async getSchemes(): Promise<Scheme[]> {
    try {
      const response = await api.get("/schemes");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch schemes. Please try again.");
    }
  }

  static async addScheme(schemeData: {
    name: string;
    description: string;
  }): Promise<void> {
    try {
      await api.post("/schemes", schemeData);
    } catch (error) {
      throw new Error("Failed to add scheme. Please try again.");
    }
  }

  static async updateScheme(
    _id: string,
    schemeData: { name?: string; description?: string }
  ): Promise<void> {
    try {
      await api.put(`/schemes/${_id}`, schemeData);
    } catch (error) {
      throw new Error("Failed to update scheme. Please try again.");
    }
  }

  static async deleteScheme(_id: string): Promise<void> {
    await api.delete(`/schemes/${_id}`);
  }

  static async checkSchemeRecords(_id: string): Promise<boolean> {
    try {
      const response = await api.get(`/scheme-records/${_id}`);
      return response.data.hasRecords;
    } catch (error) {
      throw new Error("Failed to check scheme records. Please try again.");
    }
  }
}
