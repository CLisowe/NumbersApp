import { useMemo, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useAppTheme } from "@/theme/theme";
import HamburgerMenu from "@/components/HamburgerMenu";
import ProductCard, { Product } from "@/components/ProductCard";
import CreateProductButton from "@/components/CreateProductButton";
import PullToRefreshList from "@/components/PullToRefreshList";
export default function LiveInventoryScreen() {
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const [products, setProducts] = useState<Product[]>([
    { id: "A", name: "Product A", quantity: 20 },
    { id: "B", name: "Product B", quantity: 12 },
    { id: "C", name: "Product C", quantity: 7 },
  ]);
  
  const createProduct = (p:{name:string; quantity: number}) =>{
    setProducts((prev) => [
      ...prev, 
      {
        id: "A", //remove this later
        name: p.name,
        quantity: p.quantity,
      },
    ]);

    //add POST products here

  };

  const updateProduct = (next: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === next.id ? next : p))
    );

    // 🔌 later: API call here

  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // 🔌 later: API delete
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
    <View style={styles.container}>
      {}
      <HamburgerMenu
        title="Numbers App"
        subtitle="Live Inventory"
        items={[
          { label: "Live Inventory", onPress: () => {} },
          { label: "Orders", onPress: () => {} },
          { label: "Settings", onPress: () => {} },
        ]}
      />
      <CreateProductButton onCreate={createProduct}/>
      <PullToRefreshList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        onRefreshAsync={async () => {
    // later: const latest = await api.fetchProducts();
    // setProducts(latest);

    // demo refresh: pretend something changed
    setProducts((prev) =>
      prev.map((p) =>
        p.id === "A" ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  }}
  renderItem={({ item }) => (
    <ProductCard
      product={item}
      onUpdate={updateProduct}
      onDelete={deleteProduct}
    />
  )}
/>
    </View>
  );
}
