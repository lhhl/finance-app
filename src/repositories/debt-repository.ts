import { AddDebtRequest } from "../models/add-debt-request";
import { Debt } from "../models/debt";
import { SupabaseClient } from "@supabase/supabase-js";

export class DebtRepository {
  tableName = "debts";
  constructor(private supabase: SupabaseClient) {}
  async list(): Promise<Debt[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        funds (*),
        debt_contacts (*)
      `);

    if (error) {
      console.error("Error fetching debts:", error);
      return [];
    }
    return data.map(debt => new Debt(debt));
  }

  async add(debt: AddDebtRequest): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .insert([debt]);
    if (error) {
      console.error("Error adding debt:", error);
      return false;
    }
    return true;
  }

  async update(debtId: number, debt: Partial<Debt>): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update(debt)
      .eq("id", debtId);
    if (error) {
      console.error("Error updating debt:", error);
      return false;
    }
    return true;
  }

  async delete(debtId: number): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", debtId);
    if (error) {
      console.error("Error deleting debt:", error);
      return false;
    }
    return true;
  }
}