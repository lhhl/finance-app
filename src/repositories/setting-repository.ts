import { Setting } from "../models/setting";
import { SupabaseClient } from "@supabase/supabase-js";

export class SettingRepository {
  tableName = "bot_settings";
  constructor(private supabase: SupabaseClient) {}

  async list(): Promise<Setting[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*");

    if (error) {
      console.error("Error fetching settings:", error);
      return [];
    }
    return data.map(setting => new Setting(setting.id, setting.key, setting.value));
  }

  async get(key: string): Promise<Setting | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("key", key)
      .single();

    if (error) {
      console.error("Error fetching setting:", error);
      return null;
    }
    return data ? new Setting(data.id, data.key, data.value) : null;
  }

  async set(key: string, value: string): Promise<boolean> {
    const existingSetting = await this.get(key);

    if (existingSetting) {
      const { error } = await this.supabase
        .from(this.tableName)
        .update({ value })
        .eq("key", key);

      if (error) {
        console.error("Error updating setting:", error);
        return false;
      }
    } else {
      const { error } = await this.supabase
        .from(this.tableName)
        .insert([{ key, value }]);

      if (error) {
        console.error("Error creating setting:", error);
        return false;
      }
    }
    return true;
  }

  async delete(key: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("key", key);

    if (error) {
      console.error("Error deleting setting:", error);
      return false;
    }
    return true;
  }
}
