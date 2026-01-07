import { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useAppTheme } from "@/theme/theme";
import HamburgerMenu from "@/components/HamburgerMenu";
import ProductCard, { Product } from "@/components/ProductCard";
import CreateProductButton from "@/components/CreateProductButton";
import PullToRefreshList from "@/components/PullToRefreshList";
import { supabase } from "@/lib/supabase";
import { Router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


export default function LiveInventoryScreen() {
  const { colors, spacing } = useAppTheme();

  const [products, setProducts] = useState<Product[]>([]); 

  const fetchProducts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("products")
      .select("id,name,quantity")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setProducts(data ?? []);
  };

  async function updateProduct (next: Product)  {
    const {data, error} = await supabase
    .from("products")
    .update({name:next.name, quantity: next.quantity})
    .eq("id", next.id)
    .select()
    .single();
    console.log("[DB] update product", {next, data, error});

    if(error) return{ok:false as const, error: error.message};

    setProducts((prev)=> prev.map((p) => (p.id === next.id ? next : p)));

    return {ok: true as const};
  }

  async function deleteProduct (id: string){

    const confirmed = await new Promise<boolean>((resolve)=> {
      Alert.alert(
        "Delete Product?",
        "This cannot be undone.",
        [
          {text: "Cancel", style:"cancel", onPress: () => resolve(false)},
          {text: "Delete", style: "destructive", onPress: () => resolve(true)}, 
        ],
        {cancelable: true, onDismiss: () => resolve(false)}
      );
    });

    if(!confirmed){
      return {ok:true as const};
    }

    setProducts((prev)=> prev.filter((p)=> p.id!==id));

    const{data, error} = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select();

    console.log("[DB] delete product", {id, data, error});

    if(error){
      await fetchProducts().catch(console.error);
      return {ok:false as const, error: error.message};
    } 
    return {ok:true as const};
  }

  useEffect(() => {
    fetchProducts().catch(console.error);
  }, []);

  const createProduct = async (p: { name: string; quantity: number }) => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error("Not logged in");

    const { data, error } = await supabase
      .from("products")
      .insert({
        user_id: session.user.id,
        name: p.name,
        quantity: p.quantity,
      })
      .select()
      .single();

    if (error) throw error;

    setProducts((prev) => [
      ...prev,
      { id: data.id, name: data.name, quantity: data.quantity },
    ]);
  };


  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
          padding: spacing.lg,
        },
      }),
    [colors, spacing]
  );

  return (
    <SafeAreaView style = {{flex:1, backgroundColor: colors.background}} edges={["top"]}>
    <View style={styles.container}>
      <HamburgerMenu
        title="Numbers App"
        subtitle="Live Inventory"
        items={[
          { label: "Live Inventory", onPress: () => {} },
          { label: "Orders", onPress: () => {} },
          { label: "Settings", onPress: () => {} },
        ]}
      />

      <CreateProductButton onCreate={createProduct} />

      <PullToRefreshList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        onRefreshAsync={fetchProducts}
        renderItem={({ item }) => (
          <ProductCard product={item} onUpdate={updateProduct} onDelete={deleteProduct} />
        )}
      />
    </View>
    </SafeAreaView>
  );
}
