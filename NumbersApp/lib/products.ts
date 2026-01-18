import { requireNativeComponent } from "react-native";
import { supabase } from "./supabase";

async function requireUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) throw new Error("Not authenticated");
  return session.user;
}

export type ProductRow = {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  created_at?: string;
  is_favorite: boolean;
};

export type NewProductInput = {
  name: string;
  quantity: number;
  is_favorite?:boolean;
}

export async function createProduct(name: string, quantity: number) {
  const user = await requireUser();

  const { error } = await supabase.from("products").insert({
    user_id: user.id,
    name,
    quantity,
  });

  if (error) throw error;
}

export async function listProducts(): Promise<ProductRow[]> {
  const user = await requireUser();

  const { data, error } = await supabase
    .from("products")
    .select("id,user_id,name,quantity,created_at,is_favorite")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductRow[];
}

export async function updateProduct(id: string, next: { name: string; quantity: number; is_favorite: boolean }) {
  const user = await requireUser();

  const { error } = await supabase
    .from("products")
    .update({ name: next.name, quantity: next.quantity, is_favorite: next.is_favorite })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const user = await requireUser();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function createProductsBulk(items: NewProductInput[]){
  const user = await requireUser();

  const payload = items
    .map((p)=> ({
      user_id: user.id, 
      name: String(p.name??"").trim(),
      quantity: Number.isFinite(p.quantity) ? p.quantity: 0,
      is_favorite: p.is_favorite ?? false, 
    }))
    .filter((p)=>p.name.length>0);

    if(payload.length===0) return {inserted: 0};

    const {data, error} = await supabase
    .from("products")
    .insert(payload)
    .select("id");

    if(error) throw error; 

    return {inserted: data?.length ?? payload.length};
}
