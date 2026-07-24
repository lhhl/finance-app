import { Contact } from "../models/contact";
import { SupabaseClient } from "@supabase/supabase-js";

export class ContactRepository {
  tableName = "debt_contacts";
  constructor(private supabase: SupabaseClient) {}
  async list(): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        debts (
          *,
          funds (name)
        )
      `);

      console.log("Fetched debts:", data); // Log the fetched data for debugging

    if (error) {
      console.error("Error fetching debts:", error);
      return [];
    }
    return data.map(contact => new Contact(contact));
  }

  async detail(contactId: number): Promise<Contact | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        debts (
          *,
          funds (*)
        )
      `)
      .eq("id", contactId)
      .single();

    if (error) {
      console.error("Error fetching contact detail:", error);
      return null;
    }
    return new Contact(data);
  }

  async add(contact: Contact): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .insert([contact]);
    if (error) {
      console.error("Error adding contact:", error);
      return false;
    }
    return true;
  }

  async update(contactId: number, contact: Contact): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update(contact)
      .eq("id", contactId);
    if (error) {
      console.error("Error updating contact:", error);
      return false;
    }
    return true;
  }

  async delete(contactId: number): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", contactId);
    if (error) {
      console.error("Error deleting contact:", error);
      return false;
    }
    return true;
  }

  async getFeeCharges(): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(`
        *,
        fee_charges (
          *,
          funds (name)
        )
      `)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching fee charges:", error);
      return [];
    }
    return data.map(contact => new Contact(contact));
  }
}