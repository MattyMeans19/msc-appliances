import Navbar from "@/components/navbar";
import "@/app/globals.css";
import Footer from "@/components/footer";

export default function NotFound(){
    return(
        <div className="grow flex flex-col min-h-screen">
            <Navbar />
            <p className="grow h-full text-center place-content-center  text-8xl p-50 pb-100">Sorry we couldn't find what you were looking for,
            or the page doesn't exist.</p>
            <Footer />
        </div>   
        
    )
}