import Link from "next/link";
import Iframe from "react-iframe";


export default function UsedParts(){
    return(
        <div className="grow flex flex-col gap-15 text-center">
            <h1 className="text-6xl">50% OFF MSRP on all used appliance parts for all your repair needs!</h1>
            <Link href="https://www.ebay.com/sch/i.html?_nkw=&_armrs=1&_from=&_ssn=sr_metrosc&_ipg=200&rt=nc">Click here to visit our ebay page</Link>
        </div>
    )
}