import { GetAllSpecials } from "@/actions/business/specials"
import SpecialsEditor from "./specials-editor"

export default async function SpecialsSelector(){
    const specials = await GetAllSpecials();
    
    return(
        <SpecialsEditor
            specials = {specials!.specialsResult}

        />
    )
}