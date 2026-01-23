'use client'
import { CldImage } from "next-cloudinary";


interface SelectedProduct{
        name: string,
        sku: string,
        photo: string,
        count: number,
        price: number
}
export default function InventoryItem(props: SelectedProduct){
    const product = props;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return(
        <div>
            <h1 className="font-bold text-xl">{product.name}</h1>
            <h2 className="text-center">Sku: {product.sku}</h2>
            <CldImage 
                alt="product image"
                width={500}
                height={500}
                src={product.photo}
                crop="fill"
            />
            <div className="flex flex-nowrap justify-between">
                <h3>stock: {product.count}</h3>
                <h3>${formatter.format(product.price/100)}</h3>   
            </div>
                        
        </div>
    )
}