import { SupabaseClient } from "@supabase/supabase-js";
import { FeeCharge } from "../models/fee-charges";

export class FeeChargeRepository {
  tableName = "fee_charges";

  constructor(private supabase: SupabaseClient) {}

  async list(): Promise<FeeCharge[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        funds (name),
        debt_contacts (name)
        `);

    if (error) {
      console.error("Error fetching fee charges:", error);
      return [];
    }
    return data || [];
  }

  async get(id: number): Promise<FeeCharge | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching fee charge:", error);
      return null;
    }
    return data || null;
  }

  async getCurrent(): Promise<FeeCharge | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching current fee charge:", error);
      return null;
    }
    return data || null;
  }

  async add(feeCharge: Omit<FeeCharge, "id" | "created_at" | "updated_at">): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .insert([feeCharge]);

    if (error) {
      console.error("Error adding fee charge:", error);
      return false;
    }
    return true;
  }

  async update(id: number, feeCharge: Partial<Omit<FeeCharge, "id">>): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update(feeCharge)
      .eq("id", id);

    if (error) {
      console.error("Error updating fee charge:", error);
      return false;
    }
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting fee charge:", error);
      return false;
    }
    return true;
  }
}
