import { CldImage } from "next-cloudinary"

interface Image{
    source: string;
    remove_photo: Function
}

export default function NewImagePreview(image: Image){

    async function Delete(){
        try {
            await fetch("/api/delete-photo", {
                method: "POST",
                body: JSON.stringify({ publicId: image.source }),
            });
            console.log("Deleted:", image.source);
            image.remove_photo(image.source)
        } catch (err) {
            console.error("Could not delete old photo", err);
        }
    }

    return(
        <div className="col-span-1 relative">
            <button className="absolute md:right-0 md:top-0 text-xs right-[-10] top-[-10] cursor-pointer"
                onClick={() => (Delete())}>
                ❌
            </button>
            <CldImage 
                alt="product image"
                height={1920}
                width={1080}
                crop="fit"
                src={image.source}
                className="size-15 lg:size-25 cursor-pointer"
            />
        </div>
    )
}