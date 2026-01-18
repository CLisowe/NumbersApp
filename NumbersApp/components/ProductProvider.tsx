import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import { listProducts, updateProduct as updateProductDb, type ProductRow } from '@/lib/products';
import { setNativeProps } from 'react-native-reanimated';

export type Product = {
    id: string; 
    name: string; 
    quantity: number; 
    is_favorite: boolean;
};

type Ctx = {
    products: Product[];
    refresh: () => Promise<void>;
    updateProduct: (next: Product) => Promise<void>;
    removeProduct: (id: string) => void;
};

const ProductsContext = createContext<Ctx | null>(null);

export function ProductProvider({children}:{children: React.ReactNode}) {
    const [products, setProducts] = useState<Product[]>([]);

    const refresh = useCallback(async () => {
        const rows: ProductRow[] = await listProducts();
        setProducts(
            rows.map((r)=>({
                id: r.id, 
                name: r.name, 
                quantity: r.quantity, 
                is_favorite: r.is_favorite, 
            }))
        );
    }, []);

        const removeProduct = useCallback((id:string) => {
        setProducts((prev)=>prev.filter((p)=>p.id !== id));
    }, []);



    const updateProduct = useCallback(async(next: Product) =>{
        await updateProductDb(next.id, {
            name: next.name, 
            quantity: next.quantity, 
            is_favorite: next.is_favorite, 
        });
        setProducts((prev)=> prev.map((p)=>(p.id === next.id ? next:p)));
    }, []);

    const value = useMemo(()=>({products, refresh, updateProduct, removeProduct}), [products, refresh, updateProduct, removeProduct]);

    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts(){
    const ctx = useContext(ProductsContext);
    if(!ctx) throw new Error("useProducts must be used inside ProductsProvider");
    return ctx;
}
