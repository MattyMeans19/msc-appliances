import { GetProducts } from "@/actions/business/inventory";
import { Product } from "@/lib/definitions";
import Link from "next/link";
import ConsumerInventoryItem from "./consumer-inventory-item";

export default async function ProductList() {
    const list = await GetProducts() as Product[];
    

    return (
        <>
            {list.map((product: Product) => (
                <Link href={`/Products/${product.sku}`} key={product.id} className="col-span-1 h-fit row-span-1 p-5 rounded-3xl shadow-2xl shadow-slate-500/30 border">
                    <ConsumerInventoryItem 
                        name={product.name}
                        sku={product.sku}
                        photo={product.photos[product.photos.length - 1]}
                        count={product.count}
                        price={product.price}
                        on_sale={product.on_sale}
                    />  
                </Link>
            ))}
        </>
    );
}