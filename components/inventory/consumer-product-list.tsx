import { GetProducts } from "@/actions/business/inventory";
import InventoryItem from "@/components/inventory/inventory-item";
import { Product } from "@/lib/definitions";

export default async function ProductList() {
    const list = await GetProducts() as Product[];

    return (
        <>
            {list.map((product: Product) => (
                <div key={product.id} className="col-span-1 row-span-1 p-5 rounded-3xl shadow-2xl shadow-slate-500/30 border">
                    <InventoryItem 
                        name={product.name}
                        sku={product.sku}
                        photo={product.photos[product.photos.length - 1]}
                        count={product.count}
                        price={product.price}
                    />  
                </div>
            ))}
        </>
    );
}