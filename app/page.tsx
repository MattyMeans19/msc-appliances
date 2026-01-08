import Image from "next/image";
import Appliances from "@/public/Appliances.png";

export default function Home() {
  return (
    <div className="grow m-15 mt-0 border-10 border-gray-400/60 rounded-4xl grid grid-cols-3 p-10">
        <Image 
          src={Appliances}
          width={1024}
          height={1024}
          alt="Array of appliances for display"
        />
    </div>
  );
}
