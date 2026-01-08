import Link from "next/link"

interface VisiblityProps {
    visible: boolean
}

export default function Drawer(props: VisiblityProps){
    return(
        <div className={`flex flex-col gap-5 ${props.visible? 'visible' : 'hidden' } 
            absolute top-106 left-0 bg-white border-r border-b rounded-b-3xl border-red-500 p-10`}>
            <Link href="/" className="Nav-Item" aria-description="Return to home page">Home</Link>
            <Link href="/" className="Nav-Item" aria-description="Products page link" >Products</Link>
            <Link href="/" className="Nav-Item" aria-description="Delivery and Refunds information page">Delivery and Refunds</Link>
            <Link href="/UsedParts" className="Nav-Item" aria-description="Link to current cart">Used Parts</Link> 
        </div>
    )
}