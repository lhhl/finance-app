import { AddFundRequest } from "../models/add-fund-request";
import { Fund } from "../models/fund";
import { SupabaseClient } from "@supabase/supabase-js";

export class FundRepository {
  tableName = "funds";
  constructor(private supabase: SupabaseClient) {}
  async list(): Promise<Fund[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        debts (
          *
        )
      `);

    if (error) {
      console.error("Error fetching funds:", error);
      return [];
    }
    return data.map(fund => new Fund(fund));
  }

  async detail(id: number): Promise<Fund | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        debts (
          *,
          funds (*),
          debt_contacts (*)
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching fund detail:", error);
      return null;
    }
    console.log("Fetched fund detail:", data); // Log the fetched data for debugging
    return data ? new Fund(data) : null;
  }

  async add(fund: AddFundRequest): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .insert([fund]);
    if (error) {
      console.error("Error adding fund:", error);
      return false;
    }
    return true;
  }

  async update(fundId: number, fund: AddFundRequest): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update(fund)
      .eq("id", fundId);
    if (error) {
      console.error("Error updating fund:", error);
      return false;
    }
    return true;
  }

  async delete(fundId: number): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", fundId);
    if (error) {
      console.error("Error deleting fund:", error);
      return false;
    }
    return true;
  }

  async refinance(fundId: number, sourceId: number): Promise<boolean> {
    const { error: debtError } = await this.supabase
      .from('debts')
      .update({ fund_id: sourceId })
      .eq("fund_id", fundId);

    const { error: fundError } = await this.supabase
      .from(this.tableName)
      .update({ refinance_date: new Date() })
      .eq("id", fundId);

    if (debtError || fundError) {
      console.error("Error refinancing fund:", debtError || fundError);
      return false;
    }
    return true;
  }
}