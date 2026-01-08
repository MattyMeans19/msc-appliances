import Link from "next/link";

export default function Footer(){
    return(
        <div className="w-full border-t mb-5 flex flex-row flex-wrap justify-center gap-5 text-gray-400">
            <h3 aria-description="Copyright 2026 Metro Service Company LLC">Copyright © 2026 Metro Service Company LLC</h3>
            <h3 className="hidden md:block">|</h3>
            <Link href="https://matthew-means.dev" target="_blank" aria-description="Link to this Webpage Developer's professional website">Webmaster</Link>
        </div>
    )
}