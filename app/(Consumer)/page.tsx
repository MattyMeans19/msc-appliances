import Link from "next/link";
import Specials from "@/components/specials-modal";

export default function Home() {
  return (
    <div className="grow grid grid-cols-4 pt-10 lg:pt-0 px-10 gap-5 relative">
          <div className="row-start-5 col-span-2 md:text-3xl text-black h-full place-content-center w-full text-center">
              <Link href="https://www.google.com/maps/place/MSC+Appliance+Sales+%26+Service+LLC/@35.0876164,-106.5811559,
              17z/data=!3m1!4b1!4m6!3m5!1s0x87220ae0171528d5:0x2b6d81b71f870375!8m2!3d35.0876164!4d-106.5811559!16s%2Fg%2F11c3svpk5w?
              entry=ttu&g_ep=EgoyMDI2MDEwNi4wIKXMDSoASAFQAw%3D%3D" target="_blank">
                  Visit us at <p className="text-blue-400">5815 Lomas Blvd NE Albuquerque, NM 87110</p>
              </Link>
          </div>
          <div className="col-span-full col-start-3 row-start-5 text-center place-content-center md:text-2xl">
              <p>Business Hours:<br/>Monday-Friday 9am-5pm <br/>Saturday 9am-3pm<br/>Sunday CLOSED</p>
          </div>
          <Specials />
        <div className="Text-Box row-start-3 place-self-start place-content-center h-full">
          <p>
            At Metro Service Company LLC we are dedicated to providing the best 
            appliances to match your needs at affordable prices that just can't be beat!
          </p>
          <br/>
          <Link href="/Products" className="p-2 lg:p-5 border-5 shadow-lg shadow-gray-800 border-slate-700 text-white bg-red-500 rounded-3xl">
            Shop All Products
          </Link>
        </div>

        <div className="Text-Box row-start-4 h-fit">
          <p>
            Looking for parts?
            <br/>
            Check out our Ebay used parts store: 
            <br/>
            <Link href="https://www.ebay.com/sch/i.html?_nkw=&_armrs=1&_from=&_ssn=sr_metrosc&_ipg=200&rt=nc" target="_blank" className="text-blue-400">
              sr_metrosc @ Ebay
            </Link>
          </p>
        </div>
        
    </div>
  );
}
