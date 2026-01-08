import Image from "next/image";
import Appliances from "@/public/Appliances.png";

export default function Home() {
  return (
    <div className="grow flex flex-col">
        <Image 
          src={Appliances}
          width={800}
          height={800}
          alt="Array of appliances for display"
        />
    </div>
  );
}
