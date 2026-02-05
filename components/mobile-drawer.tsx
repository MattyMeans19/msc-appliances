import Link from "next/link"

interface VisiblityProps {
    visible: boolean,
    clicked: any
}

export default function Drawer(props: VisiblityProps){

    function LinkClicked(){
        props.clicked();
    }


    return(
        <div className={`flex flex-col gap-5 ${props.visible? 'visible' : 'hidden' }
            absolute top-106 left-0 z-100 bg-white border-r border-b rounded-b-3xl border-red-500 p-10`}>
            <Link href="/" className="Nav-Item" aria-description="Return to home page" onClick={() => LinkClicked()}>Home</Link>
            <Link href="/Products" className="Nav-Item" aria-description="Products page link" onClick={() => LinkClicked()}>Products</Link>
            <Link href="/Contact" aria-description="Contact information link" className="Nav-Item" onClick={() => LinkClicked()}>Contact Us</Link>
            <Link href="/About" aria-description="About Metro Service Company LLC link" className="Nav-Item" onClick={() => LinkClicked()}>About Us</Link>
        </div>
    )
}