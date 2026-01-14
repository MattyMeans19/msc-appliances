import Navbar from "@/components/navbar";
import "@/app/globals.css";

export default function NotFound(){
    return(
        <div>
            <Navbar />
            <div className="text-8xl text-center">
                <p>Sorry we couldn't find what you were looking for,
                or the page doesn't exist.</p>
            </div>   
        </div>
        
    )
}