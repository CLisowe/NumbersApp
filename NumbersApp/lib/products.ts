import {supabase} from "./supabase";

export async function createProduct (
    name:string, 
    quantity: number
) {
     const {
        data: {session},
        error: sessionError, 
     } = await supabase.auth.getSession();

     if(sessionError || !session?.user){
        throw new Error("Not authenticated");
     }

     const {error} = await supabase.from("products").insert({
        user_id: session?.user.id, 
        name, 
        quantity,
     });

     if(error){
        throw error;
     }
}